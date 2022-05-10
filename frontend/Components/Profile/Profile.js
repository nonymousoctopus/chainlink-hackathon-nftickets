import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  StatusBar,
  View,
  Text,
  ScrollView,
  Button,
  Modal,
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
//import Web3 from "web3";
//import { stringify } from "querystring";
import { keccak256 } from "ethers/lib/utils";
import { Console } from "console";
//import { setDefaultResultOrder } from "dns";

const Profile = ({ navigation }) => {
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

  //This gets the walletAddress variable to work in the render below
  const {walletAddress, chainId} = useMoralisDapp();
  //this actually works and hashes the message
  const secretMessage = "test"; //this will be replaced with some part of the metadata of the NFT ticket like the name of the event or could just remain a set phrase
  const ejs = keccak256(utils.toUtf8Bytes(secretMessage)); //this hashes the secret message the same way that solidity does
  console.log(ejs);

  //const msgParams1 = [secretMessage, walletAddress];
  //const msgParams2 = [walletAddress, secretMessage];
  const msgParams3 = [walletAddress, ejs]; //this is the working one - trying with 2 above
  const gamma = "";
  const epsilon = "This is a test message";

  //Using a state to store some stuff
  const [ethSignature, setEthSignature] = useState('this is an initial state');
  const [modalOpen, setModalOpen] = useState(false);

  //This is a test function to change the state for testing
  const clickHandler = () => {
    setEthSignature('this is a changed state');
  }

  const testabc = () => {
    authenticate({ connector })
      .then(() => {
        if (isAuthenticated) {
            console.log("My wallet address is");
            console.log(walletAddress);
            console.log("My secret phrase is");
            console.log(secretMessage);
            console.log("Generating signature");
            const testA = connector.signPersonalMessage(msgParams3).then((callback) => {
              //clickHandler();
              const something = "something";
              setEthSignature(callback);
              setModalOpen(true); 
              let gamma = callback;
              console.log("My ethSignedMessage is");
              console.log(gamma);
            });
          }
        })
      .catch(() => {});
      
  };

  //This is an attempt to just open a connection to walletconnect but not authentiate again

  const testNewSes = () => {
    authenticate({ connector })
      .then(() => {
            const testA = connector.signPersonalMessage(msgParams3).then((callback) => {
              //clickHandler();
              const something = "something";
              setEthSignature(callback);
              setModalOpen(true); 
              let gamma = callback;
              console.log("My ethSignedMessage is");
              console.log(gamma);
            });
        })
      .catch(() => {});
  };

  const testOther = () => {
    authenticate({ connector })
      .then(() => {
            const testA = connector.signPersonalMessage(msgParams3).then((callback) => {
              //clickHandler();
              const something = "something";
              setEthSignature(callback);
              setModalOpen(true); 
              let gamma = callback;
              console.log("My ethSignedMessage is");
              console.log(gamma);
            });
        })
      .catch(() => {});
  };
  
  const Click = () => {
    alert({gamma});
  };
  
//The testabc function somehow works, but can't get the qr code to update after I generate the signature yet

  return (
    <ScrollView>
    <View style={styles.container}>
      <Modal visible={modalOpen} style={styles.popup}>
      <View style={styles.code}>
      <QRCode
      //value={walletAddress}
      value={ethSignature}
      size={300}
      bgColor='black'
      fgColor='white'/>
      </View>
      </Modal>
      <View style={styles.code}>
     <QRCode
      //value={walletAddress}
      value={gamma}
      size={300}
      bgColor='black'
      fgColor='white'/>
      </View>
      <Text style={styles.text}>This is my wallet address:</Text>
      <Text style={styles.text}>{walletAddress}</Text>
      <Text style={styles.text}>Here is the signature I need to QR:</Text>
      <Text style={styles.text}>{gamma}</Text>
      <Text style={styles.text}>{ethSignature}</Text>

      <View style={styles.button}>
        <Button
          title="Test No Auth"
          color="black"
          disabledStyle={{
            borderWidth: 2,
            borderColor: "#00F",
          }}
          onPress={testOther}
          loadingProps={{ animating: true }}></Button>
      </View>
      
      
      <View style={styles.button}>
        <Button
          title="New"
          color="green"
          disabledStyle={{
            borderWidth: 2,
            borderColor: "#00F",
          }}
          onPress={testNewSes}
          loadingProps={{ animating: true }}></Button>
      </View>

      <View style={styles.button}>
        <Button
          title="Test - working"
          color="red"
          disabledStyle={{
            borderWidth: 2,
            borderColor: "#00F",
          }}
          onPress={testabc}
          loadingProps={{ animating: true }}></Button>
      </View>
      <View style={styles.button}>
        <Button
          title="Click"
          color="blue"
          disabledStyle={{
            borderWidth: 2,
            borderColor: "#00F",
          }}
          onPress={clickHandler}
          loadingProps={{ animating: true }}></Button>
      </View>

      <View style={styles.button}>
        <Button
          title="Logout"
          color="white"
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
  popup: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  code: {
    backgroundColor: "white",
    borderColor: "blue",
    borderWidth: 2,
    padding: 20,
  },
  text: {
    backgroundColor: "yellow",
    color: "black",
    marginTop: 40,
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

export default Profile;
