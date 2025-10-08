import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const Logo = require('../../assets/saveitcolor.png');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  
  // Animaciones de las monedas
  const coin1 = useRef(new Animated.Value(0)).current;
  const coin2 = useRef(new Animated.Value(0)).current;
  const coin3 = useRef(new Animated.Value(0)).current;
  const coin4 = useRef(new Animated.Value(0)).current;
  const coin5 = useRef(new Animated.Value(0)).current;
  const coin6 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación del logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animaciones de las monedas cayendo
    const animateCoins = () => {
      Animated.loop(
        Animated.stagger(200, [
          Animated.timing(coin1, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(coin2, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(coin3, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: true,
          }),
          Animated.timing(coin4, {
            toValue: 1,
            duration: 2800,
            useNativeDriver: true,
          }),
          Animated.timing(coin5, {
            toValue: 1,
            duration: 2400,
            useNativeDriver: true,
          }),
          Animated.timing(coin6, {
            toValue: 1,
            duration: 2600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateCoins();

    // Navegar a Home después de 3 segundos
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const createCoinStyle = (animValue, left, delay = 0) => ({
    position: 'absolute',
    left: left,
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, height + 100],
        }),
      },
      {
        rotate: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
    opacity: animValue.interpolate({
      inputRange: [0, 0.1, 0.9, 1],
      outputRange: [0, 1, 1, 0],
    }),
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      
      {/* Monedas animadas */}
      <Animated.View style={[styles.coin, createCoinStyle(coin1, '10%')]}>
        <View style={[styles.coinCircle, { backgroundColor: '#FFD700' }]}>
          <Text style={styles.coinSymbol}>$</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.coin, createCoinStyle(coin2, '25%')]}>
        <View style={[styles.coinCircle, { backgroundColor: '#FF6B6B' }]}>
          <Text style={styles.coinSymbol}>$</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.coin, createCoinStyle(coin3, '45%')]}>
        <View style={[styles.coinCircle, { backgroundColor: '#4ECDC4' }]}>
          <Text style={styles.coinSymbol}>$</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.coin, createCoinStyle(coin4, '65%')]}>
        <View style={[styles.coinCircle, { backgroundColor: '#95E1D3' }]}>
          <Text style={styles.coinSymbol}>$</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.coin, createCoinStyle(coin5, '80%')]}>
        <View style={[styles.coinCircle, { backgroundColor: '#F38181' }]}>
          <Text style={styles.coinSymbol}>$</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.coin, createCoinStyle(coin6, '90%')]}>
        <View style={[styles.coinCircle, { backgroundColor: '#AA96DA' }]}>
          <Text style={styles.coinSymbol}>$</Text>
        </View>
      </Animated.View>

      {/* Logo central */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>SaveIt</Text>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, { animationDelay: '0.2s' }]} />
          <View style={[styles.loadingDot, { animationDelay: '0.4s' }]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  coin: {
    position: 'absolute',
  },
  coinCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  coinSymbol: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
});