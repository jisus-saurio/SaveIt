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

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
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