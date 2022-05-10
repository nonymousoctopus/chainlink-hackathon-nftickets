// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "hardhat/console.sol";

contract NFT is ERC1155URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC1155("") {
        contractAddress = marketplaceAddress;
    }

    mapping (uint256 => string) private _uris;
    mapping (uint256 => address) private _tokenCreator;
    mapping (uint256 => uint256) public _price;

    //need to create a mapping for price that will be used in the market contract as well and price cannot be set twice - to prevent scalping

    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }

    function price(uint256 tokenId) public view returns (uint256) {
      return(_price[tokenId]);
    }

    //Creates general admitance tokens - all have same value and no seat specific data
    function createToken(string memory tokenURI, uint256 amount, bytes memory data, uint256 price) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        require(bytes(_uris[newItemId]).length == 0, "Cannot set URI twice");
        require((_price[newItemId]) == 0, "Cannot set price twice");
        require(price > 0, "price cannot be 0");
        _tokenCreator[newItemId] = msg.sender;
        _mint(msg.sender, newItemId, amount, data);
        _uris[newItemId] = tokenURI;
        _price[newItemId] = price;
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    //Creates more general admitance tokens - all have samve value and no seat specific data
    function createMoreTokens(uint256 tokenId, uint256 amount, bytes memory data) public {
        require(_tokenCreator[tokenId] == msg.sender, "You are not the token creator");
        _mint(msg.sender, tokenId, amount, data);
    }

    //need to create a transfer function that allows transfer with payable amount no higher than original price
    function sendFree (address to, uint256 tokenId, uint256 amount, bytes memory data) public {
      _safeTransferFrom(msg.sender, to, tokenId, amount, data);
      setApprovalForAll(to, true);
    }

    function useUnderscoreTransfer (address from, address to, uint256 tokenId, uint256 amount, bytes memory data) public {
      _safeTransferFrom(from, to, tokenId, amount, data);
    }

    //need to create a batch minting function

}

contract NFTMarket is ReentrancyGuard, ERC1155Holder {
  using Counters for Counters.Counter;
  //These can revert back to private soon
  Counters.Counter public _itemIds;
  Counters.Counter public _itemsSold;

  address payable owner;
  uint256 listingPrice = 1 ether;
  uint256 listingFee = 5;

  constructor() {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    uint256 amount;
    bool onSale;
  }

  struct MyItems {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    uint256 price;
    uint256 amount;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    uint256 amount, 
    bool onSale
  );

  function listNewMarketItem(address nftContract, uint256 tokenId, uint256 amount, bytes memory data) public payable nonReentrant {
    require(msg.value == (getPrice(nftContract, tokenId) * amount / listingFee), "Listing fee must equal 20% of expected sales");

      _itemIds.increment();
      uint256 itemId = _itemIds.current();
    
      idToMarketItem[itemId] =  MarketItem(
        itemId,
        nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(0)),
        getPrice(nftContract, tokenId), 
        amount,
        true
      );

      emit MarketItemCreated(
        itemId,
        nftContract,
        tokenId,
        msg.sender,
        address(0),
        getPrice(nftContract, tokenId),
        amount,
        true
      );

      NFT temp = NFT(nftContract);
      temp.useUnderscoreTransfer(msg.sender, address(this), tokenId, amount, data);
  }

  function buyMarketItem (address nftContract, uint256 itemId, uint256 amount, bytes memory data) public payable nonReentrant {
    require(idToMarketItem[itemId].amount > 0, "There are no more items to sell");
    require(msg.value == idToMarketItem[itemId].price * amount, "Please submit the asking price in order to complete the purchase");
    NFT temp = NFT(nftContract); 
    idToMarketItem[itemId].seller.transfer(msg.value);
    temp.useUnderscoreTransfer(address(this), msg.sender, idToMarketItem[itemId].tokenId, amount, data);
    idToMarketItem[itemId].amount = idToMarketItem[itemId].amount - amount;
    idToMarketItem[itemId].owner = payable(msg.sender);
    if(idToMarketItem[itemId].amount == 0){
      _itemsSold.increment();
      idToMarketItem[itemId].onSale = false;
    }
  }

  function getMarketItem(uint256 marketItemId) public view returns (MarketItem memory) {
    return idToMarketItem[marketItemId];
  }

  function checkRemaining (uint256 id) public view returns (uint256) {
      return idToMarketItem[id].amount;
  }

    function fetchItemsOnSale() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].onSale == true) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

    //This function will need to be rewritten as the owner field will no longer accurately reflect
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }


  function findMarketItemId(address _nftContract, uint256 _tokenId) public view returns(uint) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].nftContract == _nftContract && idToMarketItem[i + 1].tokenId == _tokenId) {
            itemCount = i + 1;
      }
    }
    return itemCount;
  }

  function listMoreOfMarketItem(address nftContract, uint256 tokenId, uint256 amount, bytes memory data) public payable nonReentrant {
    require(findMarketItemId(nftContract, tokenId) > 0, "This item hasn't been listed yet");
    require(idToMarketItem[findMarketItemId(nftContract, tokenId)].amount > 0, "This item has sold out, create a new listing");
    require(msg.sender == idToMarketItem[findMarketItemId(nftContract, tokenId)].seller, "Only the original seller can relist");
    require(msg.value == (getPrice(nftContract, tokenId) * amount / listingFee), "Listing fee must equal 20% of expected sales");

      uint256 itemId = findMarketItemId(nftContract, tokenId);
      uint newAmount = idToMarketItem[itemId].amount + amount;
    
      idToMarketItem[itemId] =  MarketItem(
        itemId,
        nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(0)),
        getPrice(nftContract, tokenId), 
        newAmount,
        true
      );
    NFT temp = NFT(nftContract);
    temp.useUnderscoreTransfer(msg.sender, address(this), tokenId, amount, data);
    //IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, data);  
  }

  function getPrice(address nftContract, uint256 tokenId) public view returns (uint256) {
    NFT temp = NFT(nftContract); 
    uint256 tempPrice = temp.price(tokenId); 
    return tempPrice;
  }

  //fetch market items needs to be rewritten as it resets to all zeroes 

  function fetchMyNFTsSimple() public view returns (MyItems[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
  
    for (uint i = 0; i < totalItemCount; i++) {
        NFT temp = NFT(idToMarketItem[i +1].nftContract); 
      if (temp.balanceOf(msg.sender, idToMarketItem[i + 1].tokenId) > 0) {
        itemCount += 1;
      }
    }

    MyItems[] memory personalItems = new MyItems[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
        NFT temp = NFT(idToMarketItem[i +1].nftContract); 
      if (temp.balanceOf(msg.sender, idToMarketItem[i + 1].tokenId) > 0) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        personalItems[currentIndex] = MyItems(currentItem.itemId, currentItem.nftContract, currentItem.tokenId, currentItem.price, temp.balanceOf(msg.sender, idToMarketItem[i + 1].tokenId));
        currentIndex += 1;
      }
    }
    return personalItems;
  }





//need to test sending some NFTs for free and is that will prevent their sale...

}