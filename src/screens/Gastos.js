import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardGastos from '../components/CardGastos.js';

const Logo = require('../../assets/saveit.png');

export default function Gastos({ navigation, route }) {
  const [gastos, setGastos] = useState([]);

  // Cargar gastos al iniciar
  useEffect(() => {
    loadGastos();
  }, []);

  // Escuchar cuando la pantalla recibe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadGastos();
    });
    return unsubscribe;
  }, [navigation]);

  // Recibir nuevo gasto cuando se navega de regreso desde CategoriaGastos
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
        // Ordenar por timestamp más reciente
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
      
      // Agregar el nuevo gasto al inicio
      gastosArray.unshift(newGasto);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem('gastos', JSON.stringify(gastosArray));
      
      // Actualizar el estado
      setGastos(gastosArray);
    } catch (error) {
      console.error('Error al guardar gasto:', error);
    }
  };

  const handleGastoPress = (gasto) => {
    console.log('Gasto seleccionado:', gasto);
    // Aquí puedes navegar a una pantalla de detalles o edición
  };

  const handleAddGasto = () => {
    navigation.navigate('Calculadora');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={Logo} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.headerTitle}>SaveIt</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Gastos</Text>
      </View>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddGasto}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Gastos List */}
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Gastos')}
        >
          <Text style={[styles.navIcon, styles.navIconActive]}>↗</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Egresos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItemCenter}
          onPress={() => navigation.navigate('Home')}
        >
          <View style={styles.homeButton}>
            <Text style={styles.homeIcon}>🏠</Text>
          </View>
          <Text style={[styles.navLabel, styles.navLabelHome]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Ingresos')}
        >
          <Text style={styles.navIcon}>↘</Text>
          <Text style={styles.navLabel}>Ingresos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#7C3AED',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 28,
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#7C3AED',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 40,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  navItemCenter: {
    alignItems: 'center',
    gap: 2,
    marginTop: -40,
    flex: 1,
  },
  navIcon: {
    fontSize: 24,
    color: '#C4B5FD',
  },
  navIconActive: {
    color: '#FFFFFF',
  },
  navLabel: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  navLabelHome: {
    marginTop: 6,
  },
  navLabelActive: {
    color: '#FFFFFF',
  },
  homeButton: {
    backgroundColor: '#C4B5FD',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  homeIcon: {
    fontSize: 28,
  },
});