# NFTickets

Please note - NFTickets is currently in early development - some features are not yet included in this release.

NFTickets allows users to authenticate with their blockchain wallets and generate ERC1155 tokens for their events, allowing them to create tickets that can be sold on the NFTickets Marketplace to other users. Event organisers are charged a 20% deposit fee (This is used as a stake to discouracge bad behaviour = good actors will be reimbursed 19% depostit, resulting in a final 1% fee). Buyers are able to purchase one or multiple tickets on the marketplace.

All purchases are tied to USD and utilise Chainlink pricefeed to charge realtime dolar equivalents in the chain's native asset.

Ticket buyers can then use the all to generate a privately signed message that generates a QR code on their phone.

Event organisers are able to scan QR codes for their events to ensure that attendees own tickets to their event, and are in possession of the wallet that owns the ticket, and are not impoersonating a public address that has purchased a ticket.

Staking, complaints, refunds, and slashing mechanics are not included in this release.

## This project is using:

- [ethereum-react-native-boilerplate](https://github.com/ethereum-boilerplate/ethereum-react-native-boilerplate) for most of the core functions.
- [WalletConnect v1 react-native integration](https://docs.walletconnect.com/1.0/quick-start/dapps/react-native) for authenthication (we use a slightly modiefied version, located in `./src/WalletConnect` to allow to modify the `enable` function of Moralis).
- [react-moralis](https://github.com/MoralisWeb3/react-moralis) for react hooks
- [react-native-qrcode-generator](https://github.com/rishichawda/react-native-qrcode-generator) for QR code generation
- [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker) for content upload
- [react-native-qrcode-scanner](https://github.com/moaazsidat/react-native-qrcode-scanner) for QR code scanning and verification of ticket ownership
- Formik and yup for form iupload and validation

## Smart contract

The solidity contract is located in [artifacts > contracts](https://github.com/nonymousoctopus/chainlink-hackathon-nftickets/tree/main/artifacts/contracts)

Chainlink Pricefeed is integrated into the marketplace contract (lines 90-193 for relevant sections), and calls the AVAX/USD pricefeed on the Avalanche testnet.

IPFS is accessed via a Moralis gateway.

## Installation

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
