import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header.js';
import BottomNav from '../components/BottomNav.js';
import CardIngresos from '../components/CardIngresos.js';

export default function Ingresos({ navigation, route }) {
  const [ingresos, setIngresos] = useState([]);

  useEffect(() => {
    loadIngresos();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadIngresos();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.newIngreso) {
      saveNewIngreso(route.params.newIngreso);
      navigation.setParams({ newIngreso: undefined });
    }
  }, [route.params?.newIngreso]);

  const loadIngresos = async () => {
    try {
      const savedIngresos = await AsyncStorage.getItem('ingresos');
      if (savedIngresos) {
        const ingresosArray = JSON.parse(savedIngresos);
        ingresosArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setIngresos(ingresosArray);
      } else {
        setIngresos([]);
      }
    } catch (error) {
      console.error('Error al cargar ingresos:', error);
    }
  };

  const saveNewIngreso = async (newIngreso) => {
    try {
      const savedIngresos = await AsyncStorage.getItem('ingresos');
      let ingresosArray = savedIngresos ? JSON.parse(savedIngresos) : [];
      ingresosArray.unshift(newIngreso);
      await AsyncStorage.setItem('ingresos', JSON.stringify(ingresosArray));
      setIngresos(ingresosArray);
    } catch (error) {
      console.error('Error al guardar ingreso:', error);
    }
  };

  const handleIngresoPress = (ingreso) => {
    console.log('Ingreso seleccionado:', ingreso);
  };

  const handleAddIngreso = () => {
    navigation.navigate('Calculadora', { tipo: 'ingresos' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      <Header />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Ingresos</Text>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddIngreso}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.ingresosList}
        contentContainerStyle={styles.ingresosContent}
        showsVerticalScrollIndicator={false}
      >
        {ingresos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay ingresos registrados</Text>
            <Text style={styles.emptySubtext}>Presiona el botón + para agregar uno</Text>
          </View>
        ) : (
          ingresos.map((ingreso) => (
            <CardIngresos
              key={ingreso.id}
              categoria={ingreso.categoria}
              nota={ingreso.nota}
              monto={ingreso.monto}
              fecha={ingreso.fecha}
              icono={ingreso.icono}
              onPress={() => handleIngresoPress(ingreso)}
            />
          ))
        )}
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="Ingresos" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5B21B6',
  },
  addButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#60A5FA',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: -2,
  },
  ingresosList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  ingresosContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#5B21B6',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});