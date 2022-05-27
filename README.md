# NFTickets

This project is using:

- [ethereum-react-native-boilerplate]([https://github.com/cawfree/create-react-native-dapp](https://github.com/ethereum-boilerplate/ethereum-react-native-boilerplate)) at it's core.
- [WalletConnect v1 react-native integration](https://docs.walletconnect.com/1.0/quick-start/dapps/react-native) for authenthication (we use a slightly modiefied version, located in `./src/WalletConnect` to allow to modify the `enable` function of Moralis).
- [react-moralis](https://github.com/MoralisWeb3/react-moralis) for react hooks
- [react-native-qrcode-generator](https://github.com/rishichawda/react-native-qrcode-generator) for QR code generation
- [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker) for content upload
- [react-native-qrcode-scanner](https://github.com/moaazsidat/react-native-qrcode-scanner) for QR code scanning and verification of ticket ownership
- Formik and yup for form iupload and validation

# Installation

Install all dependencies:

```sh
cd chainlink-hackathon-nftickets
yarn install

cd ios
pod install

cd ..
```

Run your App:

IMPORTANT:

- To run the app and be able to actually login do the following:

  - Make sure to have Xcode installed on your machine if you wish to run it in iOS development and Android Studio if you want it in Android.
  - For M1 users: Access apps folder then right click on Xcode and click on more info. Then select "Open Using Rosetta".
  - Connect a physical phone device. Open terminal/cmd and run `adb devices` and see if your android device id is listed.
  - Install your preferred wallet on your device: (Metamask, Trust Wallet etc..)

- IOS:
  - Command 
    `react-native run-ios` for react-native-cli package users or 
    `npx react-native run-ios` if you're using the latest recommended version of node.js
- Android:
  - Command 
    `react-native run-android` for react-native-cli package users or 
    `npx react-native run-android` if you're using the latest recommended version of node.js

# Interface

- [ethereum-react-native-boilerplate](#ethereum-react-native-boilerplate)
- [⭐️ `Star us`](#️-star-us)
- [🤝 `Need help?`](#-need-help)
- [🚀 Quick Start](#-quick-start)
- [🧭 Table of contents](#-table-of-contents)
- [🏗 Ethereum Components](#-ethereum-components)
    - [`<CryptoAuth />`](#cryptoauth-)
    - [`<NativeBalance />`](#nativebalance-)
    - [`<ERC20Balance />`](#erc20balance-)
    - [`<Assets />`](#assets-)
    - [`<RecentTransactions />`](#recenttransactions-)
    - [`<TransactionDetails />`](#transactiondetails-)
    - [`<Blockie />`](#blockie-)
    - [`<Address />`](#address-)
- [🧰 Ethereum Hooks](#-ethereum-hooks)
    - [`useERC20balance()`](#useerc20balance)
    - [`useNativeBalance()`](#usenativebalance)
    - [`useERC20Transfers()`](#useerc20transfers)
    - [`useNativeTransactions()`](#usenativetransactions)
    - [`useTokenPrice()`](#usetokenprice)
    - [`useNFTTransfers()`](#usenfttransfers)
    - [`useNFTBalance()`](#usenftbalance)

# 🏗 Ethereum Components

🛠 The ready for use react-native-components are located in `frontend/Components`. They are designed to be used anywhere in your dApp.

### `<CryptoAuth />`

📒 `<CryptoAuth />` : Easy web3 authentication via WalletConnect.

### `<NativeBalance />`

**Options**:

- chain: chain to fetch data from.

### `<ERC20Balance />`

📨 `<ERC20Balance />` : Displays all ERC20 Balances with Price.
**Options**:

- `chain`: chain to fetch data from.

### `<Assets />`

💰 `<Assets />` : Screen to display all Chain ERC20 and NAtive Assets with Prices

### `<RecentTransactions />`

💰 `<RecentTransactions />` : Screen to display all Chain ERC20 Transactions

### `<TransactionDetails />`

`<TransactionDetails />` : Modal to display all ERC20 Transaction related content

### `<Blockie />`

A custom Blockie indenticon generator for React Native.

<img src="https://user-images.githubusercontent.com/9363303/143417343-8280bd77-552f-4417-b3b2-bce6900c7dc1.jpg" width="302" height="69">
<img src="https://user-images.githubusercontent.com/9363303/143417572-7b283258-f737-4a36-81c4-ddd23d9037af.jpg" width="314.5" height="79">
<img src="https://user-images.githubusercontent.com/9363303/143417345-6c7a328f-48b8-465b-90be-2ced124c14ec.jpg" width="300" height="75.5">

**Options**:

- `address`: Address to generate Blockie Icon from.
- `size`: Size of the Icon. _For more custom sizes, edit the <Blockie/> component as to your liking_

### `<Address />`

Displays The user address that is copyable

# 🧰 Ethereum Hooks

### `useERC20balance()`

💰 Gets all token balances of a current user or specified address.

**Options**:

- `chain` (optional): The blockchain to get data from. Valid values are listed on the intro page in the Transactions and Balances section. Default value: current chain.
- `address` (optional): A user address (i.e. 0x1a2b3x...). If specified, the user attached to the query is ignored and the address will be used instead.
- `to_block` (optional): The block number on which the balances should be checked

**Returns** (Object) : number of tokens and the array of token objects

```jsx
const {fetchERC20Balance, assets} = useERC20Balance({chain: 'eth'});
```

### `useNativeBalance()`

💰 Gets native balance for a current user or specified address.

**Options**:

- `chain` (optional): The blockchain to get data from. Default value: current chain.

**Example**:

```jsx
import useNativeBalance from './hooks/useNativeBalance';

function NativeBalance() {
  const {nativeBalance} = useNativeBalance(chain);

  return (
    <View style={styles.itemView}>
      <Text style={styles.name}> {nativeBalance} </Text>
    </View>
  );
}
```

**Example return of nativeBalance** (string)

```jsx
'0.1581 BNB';

```

### `useERC20Transfers()`

🧾 Gets ERC20 token transfers of a current user or specified address.

**Options**:

- `chain` (optional): The blockchain to get data from. Valid values are listed on the intro page in the Transactions and Balances section. Default value: current chain.
- `address` (optional): A user address (i.e. 0x1a2b3x...). If specified, the user attached to the query is ignored and the address will be used instead.
- `from_date` (optional): The date from where to get the transactions (any format that is accepted by momentjs). Provide the param 'from_block' or 'from_date' If 'from_date' and 'from_block' are provided, 'from_block' will be used.
- `to_date` (optional): Get the transactions to this date (any format that is accepted by momentjs). Provide the param 'to_block' or 'to_date' If 'to_date' and 'to_block' are provided, 'to_block' will be used.
- `from_block` (optional): The minimum block number from where to get the transactions Provide the param 'from_block' or 'from_date' If 'from_date' and 'from_block' are provided, 'from_block' will be used.
- `to_block` (optional): The maximum block number from where to get the transactions. Provide the param 'to_block' or 'to_date' If 'to_date' and 'to_block' are provided, 'to_block' will be used.
- `offset` (optional): Offset.
- `limit` (optional): Limit.

**Returns** (Array) : ERC20 token transfers

### `useNativeTransactions()`

🧾 Gets the transactions from the current user or specified address. Returns an object with the number of transactions and the array of native transactions

**Options**:

- `chain` (optional): The blockchain to get data from. Valid values are listed on the intro page in the Transactions and Balances section. Default value: current chain.
- `address` (optional): A user address (i.e. 0x1a2b3x...). If specified, the user attached to the query is ignored and the address will be used instead.
- `from_date` (optional): The date from where to get the transactions (any format that is accepted by momentjs). Provide the param 'from_block' or 'from_date' If 'from_date' and 'from_block' are provided, 'from_block' will be used.
- `to_date` (optional): Get the transactions to this date (any format that is accepted by momentjs). Provide the param 'to_block' or 'to_date' If 'to_date' and 'to_block' are provided, 'to_block' will be used.
- `from_block` (optional): The minimum block number from where to get the transactions Provide the param 'from_block' or 'from_date' If 'from_date' and 'from_block' are provided, 'from_block' will be used.
- `to_block` (optional): The maximum block number from where to get the transactions. Provide the param 'to_block' or 'to_date' If 'to_date' and 'to_block' are provided, 'to_block' will be used.
- `offset` (optional): Offset.
- `limit` (optional): Limit.

**Returns** (Array) : native transactions

### `useTokenPrice()`

💰 Gets the price nominated in the native token and usd for a given token contract address

**Options**:

- `chain` (optional): The blockchain to get data from. Valid values are listed on the intro page in the Transactions and Balances section. Default value: current chain (if the chain is not supported it will use the Eth chain).
- `address` (optional): A user address (i.e. 0x1a2b3x...). If specified, the user attached to the query is ignored and the address will be used instead.
- `exchange` (optional): The factory name or address of the token exchange. Possible exchanges, for different chains are: ETH mainnet: `uniswap-v3`, `sushiswap`, `uniswap-v2`, BSC mainnet: `pancakeswap-v2`, `pancakeswap-v1`. Polygon mainnet: `quickswap`. _If no exchange is specified, all exchanges are checked (in the order as listed above) until a valid pool has been found. Note that this request can take more time. So specifying the exchange will result in faster responses most of the time._
- `to_block` (optional): Returns the price for a given blocknumber (historical price-data).

**Example**

```jsx
import {useTokenPrice} from './hooks/useTokenPrice';

const TokenPrice = () => {
  const {tokenPrice} = useTokenPrice({chain, tokenAddress});

  return (
    <View>
      <Text>{tokenPrice.usdPrice}</Text>
    </View>
  );
};
```

**Example return** (Object)

```json
{
  "exchangeAddress": "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
  "exchangeName": "Quickswap",
  "nativePrice": "0.0003 MATIC",
  "usdPrice": "$1.08"
}
```

```json
{
  "exchangeAddress": "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
  "exchangeName": "PancakeSwap v2",
  "nativePrice": "0.0005 BNB",
  "usdPrice": "$0.28"
}
```

### `useNFTTransfers()`

### `useNFTBalance()`

🎨 Gets all NFTs from the current user or address. Supports both ERC721 and ERC1155. Returns an object with the number of NFT objects and the array of NFT objects.

**Options**:

- `chain` (optional): The blockchain to get data from. Valid values are listed on the intro page in the Transactions and Balances section. Default value: current chain (if the chain is not supported it will use the Eth chain).
- `address` (optional): A user address (i.e. 0x1a2b3x...). If specified, the user attached to the query is ignored and the address will be used instead.

**Example return** (Object)

```json
[
  {
    "amount": "1",
    "block_number": "9449788",
    "block_number_minted": "9449091",
    "contract_type": "ERC1155",
    "frozen": 0,
    "image": "https://nyc-feb-19-2020.s3.amazonaws.com/skin-slip-animation.gif",
    "is_valid": 1,
    "metadata": {
      "description": "On February 19th, we will introduce the future of b̶l̶o̶c̶k̶c̶h̶a̶i̶n̶ gaming. And you’ll see why Kitties were just the start.",
      "external_url": "https://www.nycfeb192020.com/",
      "image": "https://nyc-feb-19-2020.s3.amazonaws.com/skin-slip-animation.gif",
      "name": "NYC Feb 19th 2020"
    },
    "name": "NYC February 19th 2020",
    "owner_of": "0x71a11bc477048cca56d645ffc66ca762f62d1c3c",
    "symbol": "NYCFEB192020",
    "synced_at": "2021-12-06T19:02:12.378Z",
    "syncing": 2,
    "token_address": "0xd193a22224795c43d837a3f3d7394b4d0cc15f60",
    "token_id": "1",
    "token_uri": "https://nyc-feb-19-2020.s3.amazonaws.com/metadata.json"
  }
]
```
