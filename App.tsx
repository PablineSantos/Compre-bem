import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaProdutos from './TelaListaProdutos';
import TelaDetalheProduto from './TelaDetalheProduto';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen
          name="Lista"
          component={TelaListaProdutos}
          options={{ title: 'Lista de Produtos' }}
        />
        <Stack.Screen
          name="Detalhe"
          component={TelaDetalheProduto}
          options={{ title: 'Detalhes do Produto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}