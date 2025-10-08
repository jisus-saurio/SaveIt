import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logo = require('../../assets/saveit.png');

export default function CategoriaGastos({ navigation, route }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Obtener datos de la calculadora
  const amount = route.params?.amount || '0';
  const noteFromCalc = route.params?.note || '';
  const fechaFromCalc = route.params?.fecha || '';
  
  // Obtener fecha actual si no viene de la calculadora
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };
  
  const fecha = fechaFromCalc.replace('fecha:', '') || getCurrentDate();

  const categories = [
    { id: 1, name: 'Automovil', icon: '🚗' },
    { id: 2, name: 'Casa', icon: '🏠' },
    { id: 3, name: 'Comida', icon: '🍴' },
    { id: 4, name: 'Deporte', icon: '⚽' },
    { id: 5, name: 'Ropa', icon: '👕' },
    { id: 6, name: 'Entretenimiento', icon: '🎮' },
    { id: 7, name: 'Facturas', icon: '📃' },
    { id: 8, name: 'Higiene', icon: '🧴' },
    { id: 9, name: 'Mascota', icon: '🐾' },
    { id: 10, name: 'Regalos', icon: '🎁' },
    { id: 11, name: 'Salud', icon: '💊' },
    { id: 12, name: 'Transporte', icon: '🚌' },
  ];

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    
    // Crear objeto de gasto
    const gasto = {
      id: Date.now().toString(),
      categoria: category.name,
      icono: category.icon,
      monto: parseFloat(amount),
      nota: noteFromCalc,
      fecha: fecha,
      timestamp: new Date().toISOString()
    };

    try {
      // Guardar en AsyncStorage
      await saveGastoToStorage(gasto);
      
      console.log('Gasto guardado exitosamente:', gasto);
      
      // Navegar de regreso después de un breve delay
      setTimeout(() => {
        navigation.navigate('Home');
      }, 300);
    } catch (error) {
      console.error('Error al guardar gasto:', error);
      Alert.alert('Error', 'No se pudo guardar el gasto');
    }
  };

  const saveGastoToStorage = async (gasto) => {
    try {
      // Obtener gastos existentes
      const savedGastos = await AsyncStorage.getItem('gastos');
      let gastosArray = savedGastos ? JSON.parse(savedGastos) : [];
      
      // Agregar el nuevo gasto al inicio del array
      gastosArray.unshift(gasto);
      
      // Guardar de vuelta en AsyncStorage
      await AsyncStorage.setItem('gastos', JSON.stringify(gastosArray));
      
      return true;
    } catch (error) {
      console.error('Error en saveGastoToStorage:', error);
      throw error;
    }
  };

  const handleDelete = () => {
    navigation.goBack();
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
        <Text style={styles.title}>Categoria</Text>
      </View>

      {/* Card Container */}
      <View style={styles.card}>
        {/* Fecha */}
        <View style={styles.fechaContainer}>
          <Text style={styles.fechaText}>fecha: {fecha}</Text>
        </View>

        {/* Display */}
        <View style={styles.displayContainer}>
          <Text style={styles.moneyIcon}>💵</Text>
          <Text style={styles.display}>{amount}</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteIcon}>⌫</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <ScrollView 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory?.id === category.id && styles.categoryButtonSelected
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Gastos')}
        >
          <Text style={styles.navIcon}>↗</Text>
          <Text style={styles.navLabel}>Egresos</Text>
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
  card: {
    flex: 1,
    backgroundColor: '#C7BAF5',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    marginBottom: 100,
  },
  fechaContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fechaText: {
    fontSize: 14,
    color: '#5B21B6',
    fontWeight: 'bold',
  },
  displayContainer: {
    backgroundColor: '#9DECB8',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  moneyIcon: {
    fontSize: 24,
  },
  display: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 26,
    color: '#5B21B6',
  },
  categoriesScroll: {
    flex: 1,
  },
  categoriesContent: {
    paddingBottom: 10,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#B39DDB',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryButtonSelected: {
    backgroundColor: '#7C3AED',
    elevation: 4,
  },
  categoryIcon: {
    fontSize: 36,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
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
  navLabel: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  navLabelHome: {
    marginTop: 6,
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