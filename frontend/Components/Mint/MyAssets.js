import React, { useState, createRef, useRef, useEffect, useLayoutEffect } from "react";
import {View, Pressable, StyleSheet, Image, Text, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, Dimensions, Button} from 'react-native';
import {useMoralis,   useMoralisWeb3Api, useMoralisWeb3ApiCall, useMoralisQuery,} from 'react-moralis';
import {useNFTBalance} from '../../hooks/useNFTBalance';
import {useMoralisDapp} from '../../providers/MoralisDappProvider/MoralisDappProvider';

import WalletConnect, { useWalletConnect } from "../../WalletConnect";
import * as yup from 'yup';
import addImage from '../../../assets/image/add-image.png';
import { ethers, utils } from "ethers";
import QRCode from 'react-native-qrcode-generator';
import { keccak256 } from "ethers/lib/utils";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faXmark,
  faRotate,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const MyAssets = () => {
  const connector = useWalletConnect();
  const {NFTBalance, isLoading} = useNFTBalance();
  const {walletAddress, chainId} = useMoralisDapp();
  const {Moralis, web3, authenticate} = useMoralis();
  const NFT_CONTRACT = "0x8930341437A93a78b9bCff28764a4BFBD0bAFbEE";//avalanche testnet
  const MARKET_CONTRACT = "0xF5C999A6DC302cdaC7539423d6a14dc129f0DABa";//avalanche testnet
  const testABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "createMoreTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "tokenURI",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "createToken",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeBatchTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "sendFree",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "useUnderscoreTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "_price",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "testMe",
          "type": "address"
        }
      ],
      "name": "listMyTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "price",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const marketABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "onSale",
          "type": "bool"
        }
      ],
      "name": "MarketItemCreated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "_itemIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_itemsSold",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "buyMarketItem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "checkRemaining",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "fetchItemsOnSale",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "nftContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address payable",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "onSale",
              "type": "bool"
            }
          ],
          "internalType": "struct NFTicketsMarket.MarketItem[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "fetchMyNFTs",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "nftContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address payable",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "onSale",
              "type": "bool"
            }
          ],
          "internalType": "struct NFTicketsMarket.MarketItem[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "fetchUserNFTs",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "nftContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct NFTicketsMarket.MyItems[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "findMarketItemId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "getConversion",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "conversion",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_messageHash",
          "type": "bytes32"
        }
      ],
      "name": "getEthSignedMessageHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLatestPrice",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "marketItemId",
          "type": "uint256"
        }
      ],
      "name": "getMarketItem",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "nftContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address payable",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "onSale",
              "type": "bool"
            }
          ],
          "internalType": "struct NFTicketsMarket.MarketItem",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_message",
          "type": "string"
        }
      ],
      "name": "getMessageHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_sig",
          "type": "bytes"
        },
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        }
      ],
      "name": "hostActions",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "listMoreOfMarketItem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "listNewMarketItem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "onERC1155BatchReceived",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "onERC1155Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_ethSignedMessageHash",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "recoverSigner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "sig",
          "type": "bytes"
        }
      ],
      "name": "splitSignature",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_signer",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_message",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        }
      ],
      "name": "verify",
      "outputs": [
        {
          "internalType": "string",
          "name": "_result",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  //Storage for form completion and image selection
 const [imageUri, setImageUri] = useState('');
 const [image, setImage] = useState();
 const [imageBase64, setImageBase64] = useState();
 const { data } = useMoralisQuery("User");
 const [eventName, setEventName] = useState('Initial name');
 const [eventDescription, setEventDescription] = useState('Initial description');
 const [eventLocation, setEventLocation] = useState('Initial Location');
 const [eventDate, setEventDate] = useState('Event date (D/M/Y)');
 const [eventTime, setEventTime] = useState('Event time');
 const [imagePreview, setImagePreview] = useState(addImage);
 const [tokenURI, setTokenURI] = useState('');
 const [tokenPrice, setTokenPrice] = useState(0);
 const [tokenQuantity, setTokenQuantity] = useState(0);
 const tokenData = "0x00";
 const [transactionHash, setTransactionHash] = useState('');
 const [newItemId, setNewItemId] = useState(0);

  const [listModal, setListModal] = useState(false);
  const [QRModal, setQRModal] = useState(false);

  const readIPFS = async (currentItem, key, userSpots) => {
    let response = await fetch(currentItem);
    let readable = await response.json();
    myMints.push({eventName: readable.name, eventImage: readable.image, eventDate: readable.date, eventTime: readable.time, eventCost: readable.price, eventAmount: userSpots, eventLocation: readable.location, key: key});
  };

  const displayToken = "";
  const displayTokenDetails = "";
  const [selection1, setSelection1] = useState ([]);
  const [selection2, setSelection2] = useState ([]);
  const mySelection = [];
  const mySelection2 = [];

  const displayThisToken = async (_tempTokenID) => {
    let options1 = {
      chain: "avalanche testnet",
      address: NFT_CONTRACT, 
      function_name: "uri",
      abi: testABI, 
      params: { tokenId: _tempTokenID },
    };

    let displayToken = await Moralis.Web3API.native.runContractFunction(options1);
    let response = await fetch(displayToken);
    let displayTokenDetails = await response.json();
    let mySelection = displayTokenDetails;
    let mySelection2 = mySelection;
    await setThisSelection(mySelection);
    await listable(_tempTokenID);
    setListModal(true);
  };


  const [stillHolding1, setstillHolding1] = useState ('');
  const [stillHolding2, setstillHolding2] = useState ('');
  const listable = async (_tokenID) => {
    let options1 = {
      chain: "avalanche testnet",
      address: NFT_CONTRACT, 
      function_name: "balanceOf",
      abi: testABI, 
      params: { account: walletAddress, id: _tokenID },
    };

    let inPossession = await Moralis.Web3API.native.runContractFunction(options1);
    setTheHolding(inPossession);
  };

  const setTheHolding = async (inPossession) => {
    setstillHolding1(inPossession);
    setstillHolding2(inPossession);
  }

  const setThisSelection = async (mySelection) => {
    setSelection1(mySelection);
    setSelection2(mySelection);
  }

  const loopMe2 = async () => {
    const links = [];

    let options1 = {
      chain: "avalanche testnet",
      address: MARKET_CONTRACT, 
      function_name: "fetchUserNFTs",
      abi: marketABI,
      params: { user: walletAddress},
    };
    let result1 = await Moralis.Web3API.native.runContractFunction(options1);
    for (let i = 0; i < result1.length; i++) {
      let options2 = {
        chain: "avalanche testnet",
        address: NFT_CONTRACT, 
        function_name: "uri",
        abi: testABI, 
        params: { tokenId: result1[i][2]},
      };
      let result2 = await Moralis.Web3API.native.runContractFunction(options2);
      links.push(result2);
    }
    for (let i=0; i<result1.length; i++) {
      readIPFS(links[i],result1[i][0], result1[i][4]);
    }
    setTestThis(myMints); 
  };

  const myMints = [];
  const [testThis, setTestThis] = useState ([]);

  const testFunction = async () => {
    let options = {
      chain: "avalanche testnet",
      address: NFT_CONTRACT, 
      function_name: "listMyTokens",
      abi: testABI, 
      params: { testMe: walletAddress },
    };
    let result = await Moralis.Web3API.native.runContractFunction(options);
  };
      
  const refreshAll = ()  => {
    loopMe2();
    myMints.push(testThis);

  };


  const newHold = 0;
  const [testHold, setTestHold] = useState(1);
  const listThisItem = async (item) => {
    let newHold = item;
    setTestHold(item);
    setTestHold(newHold);
    let temp = await displayThisToken(item);
  };

  //this starts the listing process, and works out how much the transaction should cost based on pricefeed data, conversion per uint, amount of units and works out a 20% fee in wei
  const sendToMarket = async (_tokenID, _amount) => {
    let options1 = {
      chain: "avalanche testnet",
      address: NFT_CONTRACT, 
      function_name: "price",
      abi: testABI, 
      params: { tokenId: _tokenID },
    };
    let ticketPrice = await Moralis.Web3API.native.runContractFunction(options1);
    let options2 = {
      chain: "avalanche testnet",
      address: MARKET_CONTRACT, 
      function_name: "getConversion",
      abi: marketABI, 
      params: { _price: ticketPrice },
    };
    let pricePerTicket = await Moralis.Web3API.native.runContractFunction(options2);
    let listingFee = pricePerTicket * _amount / 5;
    await completeListing(listingFee, _tokenID, _amount, selection1.name);
  };

  //This finishes the listing and pays a 20% fee to the contract
  const completeListing = React.useCallback(async ( listingFee, _tokenID, amount, name ) => {
    let price2Bytes = web3.utils.toHex(listingFee);
   try {
     const data = web3.eth.abi.encodeFunctionCall({
       name: 'listNewMarketItem',
       type: 'function',
       inputs: [{type: 'address', name: 'nftContract'}, {type: 'uint256', name: 'tokenId'}, {type: 'uint256', name: 'amount'}, {type: 'bytes', name: 'data'}, {type: 'string', name: 'name'}]
     }, [NFT_CONTRACT, _tokenID, amount, tokenData, name]) 
      let listedTickets = await connector.sendTransaction({
       data: data,
       from: connector.accounts[0],
       to: MARKET_CONTRACT,
       value: price2Bytes,
     });
   } catch (e) {
     console.error(e);
   }
 }, [connector]);

  const [forQR1, setForQR1] = useState ('');
  const [forQR2, setForQR2] = useState ('');
  const QR3 = "test";
  

  const setTheQR = async (encrypted) => {
    setForQR1(encrypted);
    setForQR2(encrypted);
    setQRModal(true);
  };

  const tryNewAuth = React.useCallback(async (_message ) => {
    const kek256 = keccak256(utils.toUtf8Bytes(_message));
    const parameters = [walletAddress, kek256];
    let signed = await connector.signPersonalMessage(parameters);
    setTheQR(signed);
 }, [connector]);


  return (
    <View style={styles.mainBody}>
      <Modal visible={listModal} animationType='slide'>

      <View style={styles.centered}>
        <TouchableOpacity
            style={styles.conButtonRed}
            activeOpacity={0.5}
            onPress={() => setListModal(false)}>
            <FontAwesomeIcon icon={faXmark} size={24} color={"white"} />
            </TouchableOpacity>
        </View>
        <Text style={styles.formHeadingStyle}>Your event</Text>
            <Image source={{uri:selection1.image}} style={styles.eventIMG} />
            <View style={styles.eventFields}>
            <Text style={styles.eventName}>{selection1.name}</Text>
            <Text style={styles.eventDate}>{selection1.date}</Text>
            </View>
            <View style={styles.eventFields}>
            <Text style={styles.eventLocation}>{selection1.location}</Text>
            <Text style={styles.eventCost}>Ticket price ${selection1.price}</Text>
            </View>
            <View style={styles.eventFields}>
            <Text style={styles.eventLocation}>Start time: {selection1.date}</Text>
            <Text style={styles.eventCost}>My tickets: {stillHolding1}</Text>
            </View>
            <Text style={styles.eventLocation}>{selection1.description}</Text>
            <View style={styles.rightAligned}>
              <TouchableOpacity
                style={styles.iconButtonLightLGE}
                activeOpacity={0.5}
                onPress={() => tryNewAuth(selection1.name)}>
                <FontAwesomeIcon icon={faTicket} size={48} color={"white"} />
              </TouchableOpacity>
              </View>

            <Modal visible={QRModal} animationType='slide'>
            
            <View style={styles.centered}>
        <TouchableOpacity
            style={styles.conButtonRed}
            activeOpacity={0.5}
            onPress={() => setQRModal(false)}>
            <FontAwesomeIcon icon={faXmark} size={24} color={"white"} />
            </TouchableOpacity>
        </View>
            <Text style={styles.formHeadingStyle}>My ticket for: {selection1.name}</Text>  
            <View style={styles.code}>
              <QRCode
              value={forQR1}
              size={330}
              bgColor='black'
              fgColor='white'/>
              </View>
              <View style={styles.bottomOfTicket}>
              <Text style={styles.formHeadingStyle}>I hold {stillHolding1} tickets</Text>
              </View>
            </Modal>
      </Modal>
      <View style={styles.topSplit}>
      <Text style={styles.formHeadingStyle}>My Event Tickets</Text>  
            <TouchableOpacity
            style={styles.iconButtonDark}
            activeOpacity={0.5}
            onPress={refreshAll}>
            <FontAwesomeIcon icon={faRotate} size={24} color={"white"} />
            </TouchableOpacity>
      </View>
        <FlatList 
          data={testThis}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventContainer}  activeOpacity={0.5} onPress={() => listThisItem(item.key)}>
            <Image source={{uri:item.eventImage}} style={styles.eventIMG} />
            <View style={styles.eventFields}>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <Text style={styles.eventDate}>{item.eventDate}</Text>
            </View>
            <View style={styles.eventFields}>
            <Text style={styles.eventLocation}>{item.eventLocation}</Text>
            <Text style={styles.eventCost}>$ {item.eventCost}</Text>
            </View>
            <View style={styles.eventFields}>
            <Text style={styles.eventLocation}>When: {item.eventTime}</Text>
            <Text style={styles.eventCost}>My spots: {item.eventAmount}</Text>
            </View>
          </TouchableOpacity>
          )}
        />
      
    </View>
  );
};

const styles = StyleSheet.create({
  events: {
    backgroundColor: "white",
    margin: 10,
  },
  code: {
    alignSelf: "center",
    marginTop: "20%",
  },
  eventContainer: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
    elevation: 5,
    marginBottom: 15,
    borderRadius: 8,
  },
  eventFields: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventName: {
    color: "#2B2D42",
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "auto",
    padding: 10,
  },
  eventDate: {
    color: "#8D99AE",
    fontFamily: "sans-serif",
    fontWeight: "300",
    fontSize: 14,
    alignSelf: "auto",
    padding: 10,
  },
  eventLocation: {
    color: "#8D99AE",
    fontFamily: "sans-serif",
    fontWeight: "300",
    fontSize: 10,
    alignSelf: "auto",
    paddingBottom: 10,
    paddingLeft: 10,
  },
  eventCost: {
    color: "#2B2D42",
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontSize: 10,
    alignSelf: "auto",
    paddingBottom: 10,
    paddingRight: 10,
  },
  eventIMG: {
    width: "100%",
    height: 200, 
    resizeMode: 'contain',
  },
  eventsTextStyle: {
    color: "#2B2D42",
    fontFamily: "sans-serif",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "auto",
    padding: 10,
  },
  buttonLGE: {
    backgroundColor: "#2B2D42",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#2B2D42",
    height: 40,
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonLGETextStyle: {
    color: "#FFFFFF",
    paddingVertical: 6,
    fontSize: 20,
    fontFamily:"sans-serif",
    fontWeight: "300",
  },
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  getWalletTextStyle: {
    color: "#8D99AE",
    fontFamily: "sans-serif",
    textAlign: "center",
    fontWeight: "normal",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "#EF233C",
    textAlign: "center",
    fontSize: 14,
  },
  buttonLGEspecial: {
    backgroundColor: "#1ADBAB",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#2B2D42",
    height: 40,
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonLGETextStyle: {
    color: "#FFFFFF",
    paddingVertical: 6,
    fontSize: 20,
    fontFamily:"sans-serif",
    fontWeight: "300",
  },

  eventNameInput: {
    backgroundColor: "#EDF2F4",
    borderRadius: 8,
    margin: 10,
    padding: 10,
  },
  formLeft2of3: {
    marginLeft: "4%", 
    width:"59%",
    justifyContent: "space-between",
  },
  formTop:{
    flexDirection: "row",
  },
  formRight1of3: {
    marginLeft: "4%", 
    width:"29%",
  },
  formMiddle: {
    flexDirection: "row",
    marginLeft: "4%",
    marginRight: "4%",
    justifyContent: "space-between",
    marginTop: windowWidth * 0.04,
  },
  formMiddleShort: {
    flexDirection: "row",
    marginLeft: "4%",
    marginRight: "4%",
    justifyContent: "space-between",

  },
  evenSplit: {
    backgroundColor: "#EDF2F4",
    borderRadius: 8,
    padding: 10,
    width: "48%",
    color: "black",
  },
  evenSplitWhen: {
    backgroundColor: "#EDF2F4",
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10, 
    paddingTop: 15,
    paddingBottom: 15,
    width: "48%",
  },
  errorLeft: {
    width: "48%",
  },
  plColor: {
    color: "#97989a",
  },
  dateEntered: {
    color: "black",
  },
  leftInput: {
    backgroundColor: "#EDF2F4",
    borderRadius: 8,
    padding: 10,
    color: "black",
  },
  eventDescriptionInput: {
    backgroundColor: "#EDF2F4",
    borderRadius: 8,
    margin: windowWidth * 0.04,
    padding: 10,
    height: 100,
    alignContent: "flex-start",
    color: "black",
  },
  eventImage: {
    backgroundColor: "#EDF2F4",
    width: "100%",
    height: windowWidth * 0.29,
    borderRadius: 8,
    alignSelf: "center",
  },
  tokenID: {
    color: "black",
  },
  errorText: {
    color: "#EF233C",
    textAlign: "auto",
    fontSize: 8,
    marginTop: 4,
    marginBottom: 4,
  },

  button: {
    width: 200,
    backgroundColor: "red",
    elevation: 10,
    borderRadius: 15,
    shadowColor: "grey",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  centered: {
    alignSelf: "center",
  },
  rightAligned: {
    alignSelf: "flex-end",
  },
  formHeadingStyle: {
    color: "#2B2D42",
    fontFamily: "sans-serif",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 26,
    alignSelf: "auto",
    marginLeft: "4%", 
    marginBottom: 10,
  },
  topSplit: {
    width: "96%",
    marginTop: windowWidth * 0.04,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  conButtonRed: {
    backgroundColor: "#EF233C",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#EF233C",
    height: 40,
    width: 40,
    padding: 8,
    justifyContent: "space-around",
    borderRadius: 40,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  iconButtonDark: {
    backgroundColor: "#2B2D42",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#2B2D42",
    height: 40,
    width: 40,
    padding: 8,
    justifyContent: "space-around",
    borderRadius: 40,

  },
  iconButtonLight: {
    backgroundColor: "#1ADBAB",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#1ADBAB",
    height: 40,
    width: 40,
    padding: 8,
    justifyContent: "space-around",
    borderRadius: 40,
  },
  iconButtonLightLGE: {
    backgroundColor: "#1ADBAB",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#1ADBAB",
    height: 80,
    width: 80,
    padding: 16,
    justifyContent: "space-around",
    borderRadius: 80,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  bottomOfTicket: {
    marginTop: windowWidth * 0.20,
  },
});

export default MyAssets;
