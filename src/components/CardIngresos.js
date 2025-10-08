import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function CardIngresos({ 
  categoria = 'Categoria', 
  nota = '', 
  monto = 0, 
  fecha = 'DD/MM/AA',
  icono = '💰',
  onPress 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress || toggleExpand}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Icono de la categoría */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icono}</Text>
        </View>

        {/* Información de la categoría */}
        <View style={styles.infoContainer}>
          <Text style={styles.categoria}>{categoria}</Text>
          {isExpanded && nota && (
            <Text style={styles.nota}>{nota}</Text>
          )}
        </View>

        {/* Monto y botón expandir */}
        <View style={styles.rightContainer}>
          <Text style={styles.monto}>${Math.abs(monto).toFixed(2)}</Text>
          <TouchableOpacity onPress={toggleExpand}>
            <Text style={styles.chevron}>{isExpanded ? '∧' : '∨'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fecha cuando está expandido */}
      {isExpanded && (
        <View style={styles.fechaContainer}>
          <Text style={styles.fecha}>Fecha: {fecha}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#DDD6FE',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#E9D5FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
  },
  categoria: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B21B6',
    marginBottom: 4,
  },
  nota: {
    fontSize: 13,
    color: '#5B21B6',
    marginTop: 4,
    lineHeight: 18,
  },
  rightContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  monto: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  chevron: {
    fontSize: 20,
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  fechaContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#C4B5FD',
  },
  fecha: {
    fontSize: 13,
    color: '#5B21B6',
    textAlign: 'right',
  },
});