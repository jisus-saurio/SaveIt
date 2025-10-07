import { NavigationContainer } from '@react-navigation/native'; // Importa el contenedor de navegación
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Importa el creador de stack navigator

import Home from '../screens/Home.js'; // Importa la pantalla de Sesión
import Gastos from '../screens/Gastos.js'; // Importa la pantalla de Sesión
import Ingresos from '../screens/Ingresos.js'; // Importa la pantalla de Sesión

export default function Navigation() {

  const Stack = createNativeStackNavigator(); // Crea una instancia del stack navigator

  return (
    <NavigationContainer> 
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} /> 
        <Stack.Screen name="Gastos" component={Gastos} /> 

        <Stack.Screen name="Ingresos" component={Ingresos} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}