import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

function TabelaDetalheProduto({ produto }: { produto: any }) {
  return (
    <View style={stylesCard.container}>
      {produto.imagem ? (
        <Image source={produto.imagem} style={stylesCard.imagem} />
      ) : (
        <View style={[stylesCard.imagem, stylesCard.semImagemContainer]}>
          <Text style={stylesCard.semImagemTexto}>Sem imagem disponível</Text>
        </View>
      )}
      <Text style={stylesCard.titulo}>{produto.nome}</Text>
      <Text style={stylesCard.preco}>
        R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
      </Text>
      <Text style={stylesCard.estoque}>
        Disponível: {produto.estoque} em estoque
      </Text>
      <Text style={stylesCard.descricao}>{produto.descricao}</Text>
    </View>
  );
}

export default function TelaDetalheProduto({ route, produtos }: any) {
  const { id } = route.params;

  const produtoEncontrado = produtos.find(
    (p: any) => String(p.id) === String(id),
  );

  if (!produtoEncontrado) {
    return (
      <View style={styles.container}>
        <Text>Produto não encontrado.</Text>
      </View>
    );
  }

  return <TabelaDetalheProduto produto={produtoEncontrado} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

const stylesCard = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagem: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  preco: {
    fontSize: 20,
    color: "#2e8b57",
    fontWeight: "600",
    marginBottom: 8,
  },
  estoque: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F59E0B",
    marginBottom: 12,
  },
  descricao: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  semImagemContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
  },
  semImagemTexto: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
