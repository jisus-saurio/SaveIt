import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Logo = require('../../assets/saveit.png');

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Image source={Logo} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.headerTitle}>SaveIt</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#7C3AED',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImage: {
    width: 35,
    height: 35,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});