import React from "react";
import { useMoralis } from "react-moralis";
import { useWalletConnect } from "./WalletConnect";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox } from "react-native";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import CryptoAuth from "./Components/CryptoAuth";
import NFTMarketplace from "./Components/RecentTransactions/NFTMarketplace";
import Assets from "./Components/Assets/Assets";
//import Transfer from "./Components/Transfer/Transfer";
import Scanner from "./Components/Scanner/Scanner";
import Profile from "./Components/Profile/Profile";
import Header from "./Components/Header";
import NFTAssets from "./Components/NFT/NFTAssets";
import Test from "./Components/Test";
import MyAssets from "./Components/Mint/MyAssets";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCreditCard,
  faCoins,
  faUser,
  faPaperPlane,
  faRocket,
  faTicketAlt,
  faStore,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";

import Moralis from "moralis/types";

LogBox.ignoreAllLogs();

// const Activecolor =
function Home(): JSX.Element {
  return (
    <Tab.Navigator
      shifting={false}
      activeColor="#315399"
      // inactiveColor="#3e2465"
      barStyle={{ backgroundColor: "white" }}>
      <Tab.Screen
        name="Tickets"
        options={{
          tabBarLabel: "Tickets",
          tabBarIcon: ({ color, focused }) => {
            return <FontAwesomeIcon icon={faTicketAlt} color={color} size={20} />;
          },
        }}
        component={MyAssets}
      />
      <Tab.Screen
        name="Marketplace"
        options={{
          tabBarLabel: "Marketplace",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faStore} color={color} size={20} />
          ),
        }}
        component={NFTMarketplace}
      />
      <Tab.Screen
        name="Events"
        options={{
          tabBarLabel: "Events",
          tabBarIcon: ({ color, focused }) => {
            return <FontAwesomeIcon icon={faCalendarDay} color={color} size={20} />;
          },
        }}
        component={NFTAssets}
      />
    </Tab.Navigator>
  );
}

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";

  switch (routeName) {
    case "Tickets":
      return "Tickets";
    case "Marketplace":
      return "Marketplace";
    case "Events":
      return "Events";
  }
}

function App(): JSX.Element {
  const connector = useWalletConnect();
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
  } = useMoralis();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CryptoAuth">
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="CryptoAuth"
          component={CryptoAuth}
          options={{ headerShown: false }}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={Home}
          // Hiding header for Navigation Drawer
          options={{ headerTitle: (props) => <Header /> }}
          // options={({ route }) => ({
          //   headerTitle: getHeaderTitle(route),
          // })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
