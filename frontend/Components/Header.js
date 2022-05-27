import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import Address from './Address';
import appLogo from '../../assets/image/NFTickets_logo.png'


export default function Header() {
  return (
    <View style={styles.viewContainer}>
      <Image style={styles.logoIMG} source={require("../../assets/image/NFTickets_logo.png")} />
    </View>
  );
}
const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIMG: {
    margin: 5,
    height: 40,
    alignSelf: "center",
    resizeMode: "contain",
  },
});
