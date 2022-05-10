import React, { useState, setState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  StatusBar,
  View,
  Text,
  ScrollView,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";

//import "@ethersproject/shims"
import { ethers, utils } from "ethers";

//need to run command: yarn add react-native-qrcode-generator
//then import the two lines below, the first to be able to generate qr codes, the second to get the wallet address 
import QRCode from 'react-native-qrcode-generator';
import {useMoralisDapp} from '../../providers/MoralisDappProvider/MoralisDappProvider';
import WalletConnect, { useWalletConnect } from "../../WalletConnect";

//importing QR scanner
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

//import { useMoralisWeb3Api } from "react-moralis";

import { AuthenticateABI } from '../../../artifacts/contracts/abis/AuthenticateABI';

 

const Scanner = ({ navigation }) => {
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
  } = useMoralis();

  const connector = useWalletConnect();
  //const web3Js = new Web3(Moralis.provider);
  const logoutUser = () => {
    if (isAuthenticated) {
      logout();
      navigation.replace("Auth");
    }
  };
  
  //custom qr reading
  const [testQR, setTestQR] = useState('No QR yet');
  const testScan = (data) => {
    setTestQR(data);
    passData(data);
    //ConfirmSignatureIsOnList();
  };
  let scanner = useRef(null);

//Adding the web3 interaction to check signature agains contract

//Variables
const message = "test";

//Function
const ConfirmSignatureIsOnList = () => {
  const { native } = useMoralisWeb3Api();

  const ABI = AuthenticateABI; // Add ABI of 0xdAC17F958D2ee523a2206206994597C13D831ec7
  const options = {
    chain: "mumbai",
    address: "0x8930341437A93a78b9bCff28764a4BFBD0bAFbEE", //this is just a test deployment contract address for the signature verification
    function_name: "hostActions",
    abi: ABI,
    params: { _message: message, _si: testQR},
  };

  const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(
    native.runContractFunction,
    { ...options }.then(console.log)
  );
}

//testing
const { native } = useMoralisWeb3Api();
const ABI = AuthenticateABI; // Add ABI of 0xdAC17F958D2ee523a2206206994597C13D831ec7


 //for async functions in react native uou 

const passData = async ( QRdata ) => {
  console.log(QRdata);
  //const { native } = useMoralisWeb3Api();
  let options2 = {
    chain: "mumbai",
    address: "0xA3Eaf6a3695232A853CC95dDFCB5E0448540ff69", //this is just a test deployment contract address for the signature verification
    function_name: "hostActions",
    abi: [
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
            "internalType": "string",
            "name": "_message",
            "type": "string"
          },
          {
            "internalType": "bytes",
            "name": "_sig",
            "type": "bytes"
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
        "stateMutability": "pure",
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
            "name": "_sig",
            "type": "bytes"
          }
        ],
        "name": "recover",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      }
    ],
    params: { _message: message, _sig: QRdata},
  };


  let result = await Moralis.Web3API.native.runContractFunction(options2);
  console.log(result);


}


  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.header}>This is the scanner:</Text>
      <QRCodeScanner
        onRead={(e) => (testScan(e.data))}
        ref={node => { scanner = node;}}
      />
      <Text>{testQR}</Text>
      <View style={styles.button}>
        <Button
          title="Reactivate"
          color="red"
          disabledStyle={{
            borderWidth: 2,
            borderColor: "#00F",
          }}
          onPress={() => scanner.reactivate()}
          loadingProps={{ animating: true }}></Button>
      </View>
      <View style={styles.button}>
        <Button
          title="Logout"
          color="black"
          disabledStyle={{
            borderWidth: 2,
            borderColor: "#00F",
          }}
          onPress={logoutUser}
          loadingProps={{ animating: true }}></Button>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  header: {
    fontSize: 16,
    color: "black",
    margin: 20,
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
});

export default Scanner;
