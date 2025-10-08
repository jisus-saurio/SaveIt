import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image
} from 'react-native';
import Header from '../components/Header.js';
import BottomNav from '../components/BottomNav.js';

const Logo = require('../../assets/saveit.png');

export default function Calculadora({ navigation, route }) {
  // Detectar si es ingreso o egreso
  const tipo = route.params?.tipo || 'egresos';
  const esIngreso = tipo === 'ingresos';
  
  const [amount, setAmount] = useState('0');
  const [previousAmount, setPreviousAmount] = useState('');
  const [operation, setOperation] = useState('');
  const [note, setNote] = useState('');
  
  // Obtener fecha actual
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    return `fecha:${day}/${month}/${year}`;
  };
  
  const [fecha] = useState(getCurrentDate());

  const handleNumberPress = (num) => {
    if (amount === '0') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleOperatorPress = (op) => {
    if (previousAmount && operation) {
      handleEquals();
    }
    setPreviousAmount(amount);
    setOperation(op);
    setAmount('0');
  };

  const handleDelete = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handleEquals = () => {
    if (!previousAmount || !operation) return;
    
    const prev = parseFloat(previousAmount);
    const current = parseFloat(amount);
    let result = 0;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = current !== 0 ? prev / current : 0;
        break;
      default:
        return;
    }

    setAmount(result.toString());
    setPreviousAmount('');
    setOperation('');
  };

  const handleDecimal = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.');
    }
  };

  const handleElegirCategoria = () => {
    // Validación: el monto debe ser mayor a 0
    if (!amount || amount === '0' || parseFloat(amount) <= 0) {
      alert('Por favor ingrese un monto válido');
      return;
    }

    // Navegar a la pantalla de categorías correspondiente
    const screenName = esIngreso ? 'CategoriaIngresos' : 'CategoriaGastos';
    navigation.navigate(screenName, { 
      amount: amount,
      note: note,
      fecha: fecha
    });
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{esIngreso ? 'Ingreso' : 'Gastos'}</Text>
        </View>

        {/* Card Container */}
        <View style={styles.card}>
          {/* Fecha */}
          <View style={styles.fechaContainer}>
            <Text style={styles.fechaIcon}>📅</Text>
            <Text style={styles.fechaText}>{fecha}</Text>
          </View>

          {/* Display */}
          <View style={styles.displayContainer}>
            <Text style={styles.moneyIcon}>💵</Text>
            <Text style={styles.display} numberOfLines={1}>{amount}</Text>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteIcon}>⌫</Text>
            </TouchableOpacity>
          </View>

          {/* Nota */}
          <View style={styles.notaSection}>
            <Text style={styles.notaLabel}>Nota</Text>
            <TextInput
              style={styles.notaInput}
              placeholder="Ingrese una descripción (opcional)"
              placeholderTextColor="#9CA3AF"
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Calculator Buttons */}
          <View style={styles.calculator}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('1')}>
                <Text style={styles.buttonText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('2')}>
                <Text style={styles.buttonText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('3')}>
                <Text style={styles.buttonText}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleOperatorPress('+')}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('4')}>
                <Text style={styles.buttonText}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('5')}>
                <Text style={styles.buttonText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('6')}>
                <Text style={styles.buttonText}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleOperatorPress('-')}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('7')}>
                <Text style={styles.buttonText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('8')}>
                <Text style={styles.buttonText}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('9')}>
                <Text style={styles.buttonText}>9</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleOperatorPress('×')}>
                <Text style={styles.buttonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={handleDecimal}>
                <Text style={styles.buttonText}>.</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleNumberPress('0')}>
                <Text style={styles.buttonText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleEquals}>
                <Text style={styles.buttonText}>=</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleOperatorPress('÷')}>
                <Text style={styles.buttonText}>÷</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Elegir categoria Button */}
          <TouchableOpacity 
            style={styles.categoryButton}
            onPress={handleElegirCategoria}
          >
            <Text style={styles.categoryButtonText}>Elegir categoría</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  content: {
    flex: 1,
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
    backgroundColor: '#C7BAF5',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    marginBottom: 110,
  },
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  fechaIcon: {
    fontSize: 16,
  },
  fechaText: {
    fontSize: 14,
    color: '#5B21B6',
    fontWeight: '600',
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
  notaSection: {
    marginBottom: 24,
  },
  notaLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B21B6',
    marginBottom: 10,
  },
  notaInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1F2937',
  },
  calculator: {
    gap: 14,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  button: {
    flex: 1,
    backgroundColor: '#B39DDB',
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  categoryButton: {
    backgroundColor: '#E9D5FF',
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B21B6',
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