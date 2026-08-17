import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, ImageSourcePropType } from "react-native";

export type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: ImageSourcePropType;
};

export const produtosMock: Produto[] = [
  { 
    id: 1, 
    nome: "Cadeira", 
    descricao: "Cadeira estofada, ideal para home office", 
    preco: 199.90, 
    imagem: { uri: './assets/Cadeira.jpg' } 
  },
  { 
    id: 2, 
    nome: "Mesa", 
    descricao: "Mesa de escritório em L", 
    preco: 450.00, 
    imagem: { uri: './assets/mesa.jpg'} 
  },
  { 
    id: 3, 
    nome: "Monitor", 
    descricao: "Monitor 24 polegadas Full HD", 
    preco: 850.00, 
    imagem: { uri: './assets/monitor.jpg' } 
  },
];

export default function TelaListaProdutos({ navigation }: any) {
  return (
    <View style={styles.container}>
      {produtosMock.map((produto) => (
        <TouchableOpacity 
          key={produto.id}
          style={styles.item}
          onPress={() => navigation.navigate('Detalhe', { id: produto.id })}
        >
          <Text style={styles.titulo}>{produto.nome}</Text>
          <Text>R$ {produto.preco.toFixed(2).replace('.', ',')}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCC',
    marginBottom: 8 
  },
  titulo: { fontSize: 18, fontWeight: 'bold' },
});