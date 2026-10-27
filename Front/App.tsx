import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TelaListaProdutos from "./TelaListaProdutos";
import TelaDetalheProduto from "./TelaDetalheProduto";
import { buscarProdutos, criarProduto, Produto, BASE_URL } from "./api";

const mapImagensMock: Record<string, any> = {
  Cadeira: require("./assets/Cadeira.jpg"),
  Mesa: require("./assets/mesa.jpg"),
  Monitor: require("./assets/monitor.jpg"),
};

const Stack = createNativeStackNavigator();

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState<string | null>(null);

  async function carregar() {
    try {
      setCarregando(true);
      setErroConexao(null);
      const dados = await buscarProdutos();
      const listaComImagens = dados.map((p) => ({
        ...p,
        imagem: p.imagem
          ? typeof p.imagem === "string"
            ? { uri: p.imagem }
            : p.imagem
          : mapImagensMock[p.nome] || null,
      }));
      setProdutos(listaComImagens);
    } catch (e: any) {
      console.error("Erro de conexão:", e);
      setErroConexao(
        `Não foi possível conectar ao backend (${BASE_URL}). Verifique se a API Spring Boot está iniciada.`,
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionarProduto(novo: any) {
    try {
      const salvo = await criarProduto(novo);
      const comImagem = {
        ...salvo,
        imagem: salvo.imagem
          ? typeof salvo.imagem === "string"
            ? { uri: salvo.imagem }
            : salvo.imagem
          : mapImagensMock[salvo.nome] || null,
      };
      setProdutos((atual) => [comImagem, ...atual]);
    } catch (e: any) {
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar no backend: " +
          (e.message || "Erro desconhecido"),
      );
      throw e;
    }
  }

  if (carregando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.textoCarregando}>Carregando produtos...</Text>
      </View>
    );
  }

  if (erroConexao) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.tituloErro}>Falha de Conexão</Text>
        <Text style={styles.descricaoErro}>{erroConexao}</Text>
        <TouchableOpacity
          style={styles.botaoTentarNovamente}
          onPress={carregar}
        >
          <Text style={styles.textoBotao}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen name="Lista" options={{ title: "Lista de Produtos" }}>
          {(props: any) => (
            <TelaListaProdutos
              {...props}
              produtos={produtos}
              onAdicionarProduto={adicionarProduto}
              onRecarregar={carregar}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Detalhe" options={{ title: "Detalhes do Produto" }}>
          {(props: any) => (
            <TelaDetalheProduto {...props} produtos={produtos} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F4F6F8",
  },
  textoCarregando: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  tituloErro: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 8,
  },
  descricaoErro: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  botaoTentarNovamente: {
    backgroundColor: "#0066cc",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
