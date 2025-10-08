import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen.js';
import Home from '../screens/Home.js';
import Gastos from '../screens/Gastos.js';
import Ingresos from '../screens/Ingresos.js';
import Calculadora from '../screens/Calculadora.js';
import CategoriaGastos from '../screens/CategoriaGastos.js';
import CategoriaIngresos from '../screens/CategoriaIngresos.js';

export default function Navigation() {
  const Stack = createNativeStackNavigator();

  // Configuración sin animación visible de pantalla
  const screenOptions = {
    headerShown: false,
    animation: 'none', // Sin animación de cambio de pantalla
    gestureEnabled: false, // Desactiva gestos para evitar animaciones
    
    // Transición instantánea
    animationDuration: 0,
    
    // Sin mostrar contenido debajo
    presentation: 'card',
    contentStyle: {
      backgroundColor: '#FFFFFF', // Cambia según tu color de fondo
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={screenOptions}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{
            animation: 'fade',
            animationDuration: 200,
          }}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Gastos" component={Gastos} />
        <Stack.Screen name="Ingresos" component={Ingresos} />
        <Stack.Screen name="Calculadora" component={Calculadora} />
        <Stack.Screen name="CategoriaGastos" component={CategoriaGastos} />
        <Stack.Screen name="CategoriaIngresos" component={CategoriaIngresos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Configuración de frames para animación personalizada (opcional)
// Útil si decides usar @react-navigation/stack en lugar de native-stack
export const customTransitionConfig = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

// Interpolación personalizada para transiciones más suaves
export const forSlideFromRight = ({ current, next, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
        extrapolate: 'clamp',
      }),
    },
  };
};