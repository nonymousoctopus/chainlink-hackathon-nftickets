import React, { useState, createRef, useRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  ActivityIndicator,
} from "react-native-paper";

import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";
import { useWalletConnect } from "../WalletConnect";
//import LottieView from "lottie-react-native";

import appLogo from "../../assets/image/NFTickets_logo.png";

import AsyncStorage from "@react-native-async-storage/async-storage";
//import Animation from "../splashLottie.json";

// import Loader from './Components/Loader';
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const LoginScreen = ({ navigation }) => {
  const connector = useWalletConnect();
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
  } = useMoralis();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const passwordInputRef = createRef();

  const handleCryptoLogin = () => {
    authenticate({ connector })
      .then(() => {
        if (authError) {
          setErrortext(authError.message);
          setVisible(true);
        } else {
          if (isAuthenticated) {
            navigation.replace("DrawerNavigationRoutes");
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    isAuthenticated && navigation.replace("DrawerNavigationRoutes");
  }, [isAuthenticated]);

  return (
    <Provider>
      <SafeAreaView style={styles.mainBody}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}>
          <Image style={styles.headerIMG} source={require("../../assets/image/Event.jpeg")}
          />
          <Image style={styles.logoIMG} source={require("../../assets/image/NFTickets_logo.png")}
          />
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView enabled>
              <View>
                {authError && (
                  <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                      <Dialog.Title>Authentication error:</Dialog.Title>
                      <Dialog.Content>
                        <Paragraph>
                          {authError ? authError.message : ""}
                        </Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                        <Button onPress={hideDialog}>Done</Button>
                      </Dialog.Actions>
                    </Dialog>
                  </Portal>
                )}
                {isAuthenticating && (
                  <ActivityIndicator animating={true} color={"white"} />
                )}
              </View>

              <TouchableOpacity
                style={styles.buttonLGE}
                activeOpacity={0.5}
                onPress={handleCryptoLogin}>
                <Text style={styles.buttonLGETextStyle}>Connect Wallet</Text>
              </TouchableOpacity>
              <Text
                style={styles.getWalletTextStyle}
                onPress={() =>
                  Linking.openURL("https://ethereum.org/en/wallets/")
                }>
                Get a wallet
              </Text>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  headerIMG: {
    width: "100%",
    height: "25%",
    resizeMode: "cover",
    marginBottom: "25%",
  },
  logoIMG: {
    width: "80%",
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: "25%",
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
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "600",
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
  registerTextStyle: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});
