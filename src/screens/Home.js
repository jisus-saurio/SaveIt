import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';

const Fondo = require('../../assets/fondo.png');
const Logo = require('../../assets/saveit.png');

export default function Home({ navigation }) {
  const [activeTab, setActiveTab] = useState('egresos');
  const [egresosData, setEgresosData] = useState([]);
  const [ingresosData, setIngresosData] = useState([]);
  const [fondoDisponible, setFondoDisponible] = useState(0);

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, []);

  // Recargar datos cuando la pantalla recibe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      // Cargar gastos
      const savedGastos = await AsyncStorage.getItem('gastos');
      if (savedGastos) {
        const gastosArray = JSON.parse(savedGastos);
        // Ordenar por timestamp más reciente y mostrar solo los últimos 5
        gastosArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setEgresosData(gastosArray.slice(0, 5));
      } else {
        setEgresosData([]);
      }

      // Cargar ingresos
      const savedIngresos = await AsyncStorage.getItem('ingresos');
      if (savedIngresos) {
        const ingresosArray = JSON.parse(savedIngresos);
        // Ordenar por timestamp más reciente y mostrar solo los últimos 5
        ingresosArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setIngresosData(ingresosArray.slice(0, 5));
      } else {
        setIngresosData([]);
      }

      // Calcular fondo disponible
      calcularFondoDisponible(savedGastos, savedIngresos);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const calcularFondoDisponible = (gastosString, ingresosString) => {
    let totalGastos = 0;
    let totalIngresos = 0;

    if (gastosString) {
      const gastos = JSON.parse(gastosString);
      totalGastos = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.monto || 0), 0);
    }

    if (ingresosString) {
      const ingresos = JSON.parse(ingresosString);
      totalIngresos = ingresos.reduce((sum, ingreso) => sum + parseFloat(ingreso.monto || 0), 0);
    }

    setFondoDisponible(totalIngresos - totalGastos);
  };

  const currentData = activeTab === 'egresos' ? egresosData : ingresosData;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.headerTitle}>SaveIt</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Section with Wave */}
      <ImageBackground 
        source={Fondo} 
        style={styles.balanceSection} 
        resizeMode="cover"
      >
        <View style={styles.overlayGradient} />
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Fondo disponible</Text>
          <Text style={styles.balanceAmount}>
            ${fondoDisponible.toFixed(2)}
          </Text>
        </View>

        {/* Wave SVG */}
        <View style={styles.waveContainer}>
          <Svg height="80" width="100%" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <Path
              fill="#FFFFFF"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </Svg>
        </View>
      </ImageBackground>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsBackground}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'egresos' && styles.tabActive]}
            onPress={() => setActiveTab('egresos')}
          >
            <Text style={[styles.tabText, activeTab === 'egresos' && styles.tabTextActive]}>
              Egresos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ingresos' && styles.tabActive]}
            onPress={() => setActiveTab('ingresos')}
          >
            <Text style={[styles.tabText, activeTab === 'ingresos' && styles.tabTextActive]}>
              Ingresos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView 
        style={styles.transactionsList} 
        contentContainerStyle={styles.transactionsContent}
        showsVerticalScrollIndicator={false}
      >
        {currentData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay {activeTab === 'egresos' ? 'gastos' : 'ingresos'} registrados
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'egresos' 
                ? 'Presiona el botón + para agregar uno' 
                : 'Ve a la sección de ingresos para agregar'}
            </Text>
          </View>
        ) : (
          <>
            {currentData.map((item) => (
              <View key={item.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.transactionIcon}>
                      {item.icono || (activeTab === 'egresos' ? '↗' : '↘')}
                    </Text>
                  </View>
                  <Text style={styles.transactionCategory}>{item.categoria}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  activeTab === 'egresos' ? styles.amountNegative : styles.amountPositive
                ]}>
                  ${Math.abs(item.monto).toFixed(2)}
                </Text>
              </View>
            ))}
            
            {/* Mostrar indicador si hay más items */}
            {currentData.length === 5 && (
              <TouchableOpacity 
                style={styles.verMasButton}
                onPress={() => navigation.navigate(activeTab === 'egresos' ? 'Gastos' : 'Ingresos')}
              >
                <Text style={styles.verMasText}>Ver todos →</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Add Button - Visible en ambos tabs */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Calculadora', { tipo: activeTab })}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

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
          <Text style={[styles.navLabel, styles.navLabelHome, styles.navLabelActive]}>
            Home
          </Text>
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
    elevation: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
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
  balanceSection: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200,
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
  },
  balanceContent: {
    paddingTop: 40,
    paddingBottom: 90,
    alignItems: 'center',
    zIndex: 1,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '400',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginTop: -50,
    zIndex: 10,
  },
  tabsBackground: {
    backgroundColor: '#E9D5FF',
    borderRadius: 16,
    padding: 4,
    flexDirection: 'row',
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#7C3AED',
  },
  tabText: {
    color: '#5B21B6',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  transactionsContent: {
    paddingTop: 20,
    paddingBottom: 180,
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
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  transactionItem: {
    backgroundColor: '#E9D5FF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    backgroundColor: '#3B82F6',
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  transactionCategory: {
    color: '#5B21B6',
    fontSize: 17,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  amountNegative: {
    color: '#DC2626',
  },
  amountPositive: {
    color: '#16A34A',
  },
  verMasButton: {
    backgroundColor: '#DDD6FE',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  verMasText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 170,
    alignSelf: 'center',
    backgroundColor: '#60A5FA',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: -2,
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
    backgroundColor: '#FFFFFF',
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