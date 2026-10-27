import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Image,
  Keyboard,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_FAVORITOS = "@compre_bem:favoritos";
const CHAVE_ULTIMA_BUSCA = "@compre_bem:ultima_busca";

export const produtosMock = [
  {
    id: 1,
    nome: "Cadeira",
    descricao: "Cadeira ergonômica estofada, ideal para home office",
    preco: 199.9,
    estoque: 10,
    imagem: require("./assets/Cadeira.jpg"),
  },
  {
    id: 2,
    nome: "Mesa",
    descricao: "Mesa de escritório em L com acabamento em madeira",
    preco: 450.0,
    estoque: 5,
    imagem: require("./assets/mesa.jpg"),
  },
  {
    id: 3,
    nome: "Monitor",
    descricao: "Monitor 24 polegadas Full HD com bordas finas",
    preco: 850.0,
    estoque: 15,
    imagem: require("./assets/monitor.jpg"),
  },
];

export default function TelaListaProdutos({
  navigation,
  produtos,
  onAdicionarProduto,
  onRecarregar,
}: any) {
  const [busca, setBusca] = useState("");
  const [favoritos, setFavoritos] = useState<(string | number)[]>([]);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [recarregando, setRecarregando] = useState(false);

  const inputPrecoRef = useRef<TextInput>(null);
  const inputEstoqueRef = useRef<TextInput>(null);
  const inputDescricaoRef = useRef<TextInput>(null);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_FAVORITOS).then((salvo) => {
      if (salvo) setFavoritos(JSON.parse(salvo));
    });
    AsyncStorage.getItem(CHAVE_ULTIMA_BUSCA).then((salvo) => {
      if (salvo) setBusca(salvo);
    });
  }, []);

  function alternarFavorito(id: string | number) {
    setFavoritos((atual) => {
      const novo = atual.includes(id)
        ? atual.filter((favId) => favId !== id)
        : [...atual, id];
      AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novo));
      return novo;
    });
  }

  function handleBuscaChange(texto: string) {
    setBusca(texto);
    AsyncStorage.setItem(CHAVE_ULTIMA_BUSCA, texto);
  }

  const produtosFiltrados = useMemo(() => {
    return (produtos || []).filter((produto: any) =>
      produto.nome?.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, produtos]);

  async function validarESalvar() {
    if (nome.trim() === "") {
      setErro("O nome não pode ficar vazio.");
      return;
    }

    const precoNumerico = Number(preco.trim().replace(",", "."));
    if (preco.trim() === "" || isNaN(precoNumerico) || precoNumerico <= 0) {
      setErro("O preço precisa ser um número maior que zero (ex.: 89,90).");
      return;
    }

    const estoqueNumerico = Number(estoque.trim());
    if (
      estoque.trim() === "" ||
      !Number.isInteger(estoqueNumerico) ||
      estoqueNumerico < 0
    ) {
      setErro("O estoque precisa ser um número inteiro válido (zero ou mais).");
      return;
    }

    if (descricao.trim() === "") {
      setErro("A descrição/detalhes não pode ficar vazia.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      await onAdicionarProduto({
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: precoNumerico,
        estoque: estoqueNumerico,
        categoria: "Geral",
        imagem: null,
      });

      setNome("");
      setPreco("");
      setEstoque("");
      setDescricao("");
      Keyboard.dismiss();
    } catch (e: any) {
      setErro(e.message || "Erro ao salvar produto.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRecarregar ? (
            <RefreshControl
              refreshing={recarregando}
              onRefresh={async () => {
                setRecarregando(true);
                await onRecarregar();
                setRecarregando(false);
              }}
            />
          ) : undefined
        }
      >
        <View style={styles.formContainer}>
          <TextInput
            style={styles.inputForm}
            placeholder="Nome do novo produto"
            placeholderTextColor="#888"
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
            onSubmitEditing={() => inputPrecoRef.current?.focus()}
          />

          <View style={styles.row}>
            <TextInput
              ref={inputPrecoRef}
              style={[styles.inputForm, styles.inputMeio]}
              placeholder="Preço (ex.: 89,90)"
              placeholderTextColor="#888"
              value={preco}
              onChangeText={setPreco}
              keyboardType="decimal-pad"
              returnKeyType="next"
              onSubmitEditing={() => inputEstoqueRef.current?.focus()}
            />
            <TextInput
              ref={inputEstoqueRef}
              style={[styles.inputForm, styles.inputMeio]}
              placeholder="Estoque"
              placeholderTextColor="#888"
              value={estoque}
              onChangeText={setEstoque}
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => inputDescricaoRef.current?.focus()}
            />
          </View>

          <TextInput
            ref={inputDescricaoRef}
            style={[styles.inputForm, styles.inputDescricao]}
            placeholder="Detalhes / Descrição do produto"
            placeholderTextColor="#888"
            value={descricao}
            onChangeText={setDescricao}
            multiline={true}
            numberOfLines={3}
          />

          {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botaoSalvar, salvando && { opacity: 0.7 }]}
            onPress={validarESalvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotao}>Cadastrar produto</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar produtos..."
          placeholderTextColor="#888"
          value={busca}
          onChangeText={handleBuscaChange}
        />

        {produtosFiltrados.map((produto: any) => (
          <TouchableOpacity
            key={String(produto.id)}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Detalhe", { id: produto.id })}
          >
            {produto.imagem ? (
              <Image source={produto.imagem} style={styles.miniatura} />
            ) : (
              <View style={[styles.miniatura, styles.semImagemContainer]}>
                <Text style={styles.semImagemTexto}>Sem foto</Text>
              </View>
            )}
            <View style={styles.cardInfo}>
              <Text style={styles.titulo}>{produto.nome}</Text>
              <Text style={styles.descricaoCurta} numberOfLines={1}>
                {produto.descricao}
              </Text>
              <Text style={styles.preco}>
                R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
              </Text>
              <Text style={styles.estoqueTexto}>
                Estoque: {produto.estoque} un.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.botaoFavorito}
              onPress={() => alternarFavorito(produto.id)}
            >
              <Text style={styles.favoritoTexto}>
                {favoritos.includes(produto.id) ? "♥" : "♡"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F6F8" },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  formContainer: { marginBottom: 16 },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },

  inputMeio: {
    flex: 1,
    minWidth: 130,
    marginBottom: 0,
  },
  inputForm: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputDescricao: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  erro: { color: "#C62828", marginBottom: 12, fontSize: 14, fontWeight: "500" },
  botaoSalvar: {
    backgroundColor: "#10B981",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBotao: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 16 },
  inputBusca: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  miniatura: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#EEE",
  },
  cardInfo: { flex: 1, marginLeft: 16, justifyContent: "center" },
  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  descricaoCurta: { fontSize: 14, color: "#6B7280", marginBottom: 4 },
  preco: { fontSize: 16, fontWeight: "bold", color: "#10B981" },
  estoqueTexto: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
  botaoFavorito: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  favoritoTexto: {
    fontSize: 24,
    color: "#C62828",
  },
  semImagemContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
  },
  semImagemTexto: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
