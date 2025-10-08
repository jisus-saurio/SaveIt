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
import CardGastos from '../components/CardGastos.js';

export default function Gastos({ navigation, route }) {
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    loadGastos();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadGastos();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.newGasto) {
      saveNewGasto(route.params.newGasto);
      navigation.setParams({ newGasto: undefined });
    }
  }, [route.params?.newGasto]);

  const loadGastos = async () => {
    try {
      const savedGastos = await AsyncStorage.getItem('gastos');
      if (savedGastos) {
        const gastosArray = JSON.parse(savedGastos);
        gastosArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setGastos(gastosArray);
      } else {
        setGastos([]);
      }
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    }
  };

  const saveNewGasto = async (newGasto) => {
    try {
      const savedGastos = await AsyncStorage.getItem('gastos');
      let gastosArray = savedGastos ? JSON.parse(savedGastos) : [];
      gastosArray.unshift(newGasto);
      await AsyncStorage.setItem('gastos', JSON.stringify(gastosArray));
      setGastos(gastosArray);
    } catch (error) {
      console.error('Error al guardar gasto:', error);
    }
  };

  const handleGastoPress = (gasto) => {
    console.log('Gasto seleccionado:', gasto);
  };

  const handleAddGasto = () => {
    navigation.navigate('Calculadora', { tipo: 'egresos' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      <Header />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Gastos</Text>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddGasto}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.gastosList}
        contentContainerStyle={styles.gastosContent}
        showsVerticalScrollIndicator={false}
      >
        {gastos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay gastos registrados</Text>
            <Text style={styles.emptySubtext}>Presiona el botón + para agregar uno</Text>
          </View>
        ) : (
          gastos.map((gasto) => (
            <CardGastos
              key={gasto.id}
              categoria={gasto.categoria}
              nota={gasto.nota}
              monto={gasto.monto}
              fecha={gasto.fecha}
              icono={gasto.icono}
              onPress={() => handleGastoPress(gasto)}
            />
          ))
        )}
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="Gastos" />
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
  gastosList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  gastosContent: {
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