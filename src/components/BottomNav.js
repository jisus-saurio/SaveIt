import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

// Importar iconos desde assets
const IconEgresos = require('../../assets/egreso.png');
const IconHome = require('../../assets/home.png');
const IconIngresos = require('../../assets/ingreso.png');

export default function BottomNav({ navigation, activeScreen }) {
  // Animaciones para cada botón
  const scaleEgresos = useRef(new Animated.Value(1)).current;
  const scaleHome = useRef(new Animated.Value(1)).current;
  const scaleIngresos = useRef(new Animated.Value(1)).current;
  
  // Animación de elevación para cada icono
  const elevationEgresos = useRef(new Animated.Value(0)).current;
  const elevationHome = useRef(new Animated.Value(0)).current;
  const elevationIngresos = useRef(new Animated.Value(0)).current;

  // Animación de escala para el icono activo
  const iconScaleEgresos = useRef(new Animated.Value(1)).current;
  const iconScaleHome = useRef(new Animated.Value(1)).current;
  const iconScaleIngresos = useRef(new Animated.Value(1)).current;

  // Animación de rotación para el ícono activo
  const rotateActive = useRef(new Animated.Value(0)).current;

  // Animación del círculo moviéndose
  const circlePosition = useRef(new Animated.Value(getInitialPosition(activeScreen))).current;

  // Ref para prevenir navegación múltiple
  const isNavigating = useRef(false);

  // Obtener posición inicial del círculo
  function getInitialPosition(screen) {
    switch(screen) {
      case 'Gastos': return 0;
      case 'Home': return 1;
      case 'Ingresos': return 2;
      default: return 1;
    }
  }

  useEffect(() => {
    // Animar según la pantalla activa
    if (activeScreen === 'Gastos') {
      animateCircle(0);
      animateElevation(elevationEgresos, -28, elevationHome, 0, elevationIngresos, 0);
      animateIconScale(iconScaleEgresos, 1.3, iconScaleHome, 1, iconScaleIngresos, 1);
      animateRotation();
    } else if (activeScreen === 'Home') {
      animateCircle(1);
      animateElevation(elevationEgresos, 0, elevationHome, -28, elevationIngresos, 0);
      animateIconScale(iconScaleEgresos, 1, iconScaleHome, 1.3, iconScaleIngresos, 1);
      animateRotation();
    } else if (activeScreen === 'Ingresos') {
      animateCircle(2);
      animateElevation(elevationEgresos, 0, elevationHome, 0, elevationIngresos, -28);
      animateIconScale(iconScaleEgresos, 1, iconScaleHome, 1, iconScaleIngresos, 1.3);
      animateRotation();
    } else {
      animateCircle(1);
      animateElevation(elevationEgresos, 0, elevationHome, 0, elevationIngresos, 0);
      animateIconScale(iconScaleEgresos, 1, iconScaleHome, 1, iconScaleIngresos, 1);
    }
    
    // Reset del flag cuando la animación termina
    setTimeout(() => {
      isNavigating.current = false;
    }, 200);
  }, [activeScreen]);

  const animateCircle = (position) => {
    Animated.spring(circlePosition, {
      toValue: position,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const animateElevation = (anim1, val1, anim2, val2, anim3, val3) => {
    Animated.parallel([
      Animated.spring(anim1, {
        toValue: val1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(anim2, {
        toValue: val2,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(anim3, {
        toValue: val3,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateIconScale = (anim1, val1, anim2, val2, anim3, val3) => {
    Animated.parallel([
      Animated.spring(anim1, {
        toValue: val1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(anim2, {
        toValue: val2,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(anim3, {
        toValue: val3,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateRotation = () => {
    rotateActive.setValue(0);
    Animated.timing(rotateActive, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = (scale) => {
    Animated.spring(scale, {
      toValue: 0.92,
      friction: 4,
      tension: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 150,
      useNativeDriver: true,
    }).start();
  };

  // Función mejorada para navegar con animación previa
  const handleNavigate = (screenName, targetPosition) => {
    // No hacer nada si ya estamos navegando o estamos en esa pantalla
    if (isNavigating.current || activeScreen === screenName) return;
    
    isNavigating.current = true;

    // Primero animar el círculo y los iconos (más rápido)
    Animated.parallel([
      Animated.spring(circlePosition, {
        toValue: targetPosition,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Después de la animación del círculo, navegar inmediatamente
      navigation.navigate(screenName);
    });
  };

  const rotation = rotateActive.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Calcular posición del círculo
  const circleTranslateX = circlePosition.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-115, 0, 115],
  });

  return (
    <View style={styles.bottomNav}>
      {/* Círculo grande móvil */}
      <Animated.View
        style={[
          styles.activeCircle,
          {
            transform: [{ translateX: circleTranslateX }],
          },
        ]}
      />

      {/* Botón Egresos */}
      <Animated.View
        style={[
          styles.navItemContainer,
          {
            transform: [
              { scale: scaleEgresos },
              { translateY: elevationEgresos },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigate('Gastos', 0)}
          onPressIn={() => handlePressIn(scaleEgresos)}
          onPressOut={() => handlePressOut(scaleEgresos)}
          activeOpacity={1}
        >
          <Animated.View
            style={{
              transform: [
                { scale: iconScaleEgresos },
                ...(activeScreen === 'Gastos' ? [{ rotate: rotation }] : []),
              ],
            }}
          >
            <Image 
              source={IconEgresos} 
              style={[
                styles.navIconImage,
                activeScreen === 'Gastos' && styles.navIconActive
              ]} 
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={[
            styles.navLabel,
            activeScreen === 'Gastos' && styles.navLabelActive
          ]}>
            Egresos
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Botón Home */}
      <Animated.View
        style={[
          styles.navItemContainer,
          {
            transform: [
              { scale: scaleHome },
              { translateY: elevationHome },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigate('Home', 1)}
          onPressIn={() => handlePressIn(scaleHome)}
          onPressOut={() => handlePressOut(scaleHome)}
          activeOpacity={1}
        >
          <Animated.View
            style={{
              transform: [
                { scale: iconScaleHome },
                ...(activeScreen === 'Home' ? [{ rotate: rotation }] : []),
              ],
            }}
          >
            <Image 
              source={IconHome} 
              style={[
                styles.navIconImage,
                activeScreen === 'Home' && styles.navIconActive
              ]} 
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={[
            styles.navLabel,
            activeScreen === 'Home' && styles.navLabelActive
          ]}>
            Home
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Botón Ingresos */}
      <Animated.View
        style={[
          styles.navItemContainer,
          {
            transform: [
              { scale: scaleIngresos },
              { translateY: elevationIngresos },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigate('Ingresos', 2)}
          onPressIn={() => handlePressIn(scaleIngresos)}
          onPressOut={() => handlePressOut(scaleIngresos)}
          activeOpacity={1}
        >
          <Animated.View
            style={{
              transform: [
                { scale: iconScaleIngresos },
                ...(activeScreen === 'Ingresos' ? [{ rotate: rotation }] : []),
              ],
            }}
          >
            <Image 
              source={IconIngresos} 
              style={[
                styles.navIconImage,
                activeScreen === 'Ingresos' && styles.navIconActive
              ]} 
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={[
            styles.navLabel,
            activeScreen === 'Ingresos' && styles.navLabelActive
          ]}>
            Ingresos
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#7C3AED',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 40,
    paddingTop: 18,
    paddingBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  activeCircle: {
    position: 'absolute',
    top: -17,
    left: '58.2%',
    marginLeft: -28,
    width: 75,
    height: 75,
    borderRadius: 60,
    backgroundColor: '#8773FF',
    shadowColor: '#8773FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  navItemContainer: {
    flex: 1,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navIconImage: {
    width: 24,
    height: 24,
    tintColor: '#C4B5FD',
  },
  navIconActive: {
    tintColor: '#FFFFFF',
  },
  navLabel: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#FFFFFF',
  },
});