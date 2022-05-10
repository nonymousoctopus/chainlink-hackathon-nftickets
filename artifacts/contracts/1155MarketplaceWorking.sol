// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "hardhat/console.sol";

contract NFT is ERC1155URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC1155("") {
        contractAddress = marketplaceAddress;
    }

    mapping (uint256 => string) private _uris;
    mapping (uint256 => address) private _tokenCreator;

    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }

    function createToken(string memory tokenURI, uint256 amount, bytes memory data) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        require(bytes(_uris[newItemId]).length == 0, "Cannot set URI twice");
        _tokenCreator[newItemId] = msg.sender;
        _mint(msg.sender, newItemId, amount, data);
        _uris[newItemId] = tokenURI;
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function createMoreTokens(uint256 tokenId, uint256 amount, bytes memory data) public {
        require(_tokenCreator[tokenId] == msg.sender, "You are not the token creator");
        _mint(msg.sender, tokenId, amount, data);
    }
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
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    uint256 amount
  );

  function getMarketItem(uint256 marketItemId) public view returns (MarketItem memory) {
    return idToMarketItem[marketItemId];
  }

  function createMarketItem(address nftContract, uint256 tokenId, uint256 price, uint256 amount, bytes memory data) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == (price * amount / listingFee), "Listing fee must equal 20% of expected sales");

      _itemIds.increment();
      uint256 itemId = _itemIds.current();
    
      idToMarketItem[itemId] =  MarketItem(
        itemId,
        nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(0)),
        price, 
        amount
      );

      emit MarketItemCreated(
        itemId,
        nftContract,
        tokenId,
        msg.sender,
        address(0),
        price,
        amount
      );


    IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, data); 
    
  }

  function createMarketSale(
    address nftContract,
    uint256 itemId, 
    uint256 amount, 
    bytes memory data
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price * amount;
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");
    require(idToMarketItem[itemId].amount > 0, "There are no more items to sell");

    idToMarketItem[itemId].seller.transfer(msg.value);
    IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, amount, data);
    idToMarketItem[itemId].amount = idToMarketItem[itemId].amount - amount;
    //idToMarketItem[itemId].owner = payable(msg.sender);
    if(idToMarketItem[itemId].amount == 0){
        _itemsSold.increment();
        idToMarketItem[itemId].owner = payable(msg.sender); //this sets the last buyer as the owner - may need to look at this again
        payable(owner).transfer(listingPrice);
    }
  }

  function checkRemaining (uint256 id) public view returns (uint256) {
      return idToMarketItem[id].amount;
  }

  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
   
    return items;
  }

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




  //testing


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

  function listMoreOfMarketItem(address nftContract, uint256 tokenId, uint256 price, uint256 amount, bytes memory data) public payable nonReentrant {
    require(findMarketItemId(nftContract, tokenId) > 0, "This item hasn't been listed yet");
    require(idToMarketItem[findMarketItemId(nftContract, tokenId)].amount > 0, "This item has sold out, create a new listing");
    require(price == idToMarketItem[findMarketItemId(nftContract, tokenId)].price, "This price must match the existing offer");
    require(msg.value == (price * amount / listingFee), "Listing fee must equal 20% of expected sales");

      //_itemIds.increment();
      uint256 itemId = findMarketItemId(nftContract, tokenId);
      uint newAmount = idToMarketItem[itemId].amount + amount;
    
      idToMarketItem[itemId] =  MarketItem(
        itemId,
        nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(0)),
        price, 
        newAmount
      );


    IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, data); 
    
  }



}