import { Platform } from "react-native";

// URL base da API Spring Boot:
// - No Android Emulator: 'http://10.0.2.2:8080'
// - No Navegador Web ou Simulador iOS: 'http://localhost:8080'
// - No Celular físico (Expo Go no Wi-Fi): altere para o IP do seu computador (ex.: 'http://10.144.29.85:8080')
export const BASE_URL = Platform.select({
  android: "http://10.0.2.2:8080",
  default: "http://localhost:8080",
});

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria?: string;
  imagem?: any;
}

export async function buscarProdutos(): Promise<Produto[]> {
  try {
    const resposta = await fetch(`${BASE_URL}/api/v1/produtos`);
    if (!resposta.ok) {
      throw new Error(`Servidor respondeu com status ${resposta.status}`);
    }
    const dados = await resposta.json();
    return dados.map((p: any) => ({
      id: String(p.produtoId || p.id),
      nome: p.nome,
      descricao: p.descricao,
      preco: Number(p.preco),
      estoque: Number(p.quantidade ?? p.estoque ?? 0),
      categoria: p.categoria || "",
      imagem: p.imagem || null,
    }));
  } catch (error: any) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

export async function criarProduto(novo: {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria?: string;
  imagem?: string | null;
}): Promise<Produto> {
  try {
    const resposta = await fetch(`${BASE_URL}/api/v1/produtos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: novo.nome,
        descricao: novo.descricao,
        preco: novo.preco,
        quantidade: novo.estoque,
        categoria: novo.categoria || "Geral",
        imagem: novo.imagem || null,
      }),
    });

    if (!resposta.ok) {
      throw new Error(`Erro ao salvar produto (${resposta.status})`);
    }

    const p = await resposta.json();
    return {
      id: String(p.produtoId || p.id),
      nome: p.nome,
      descricao: p.descricao,
      preco: Number(p.preco),
      estoque: Number(p.quantidade ?? p.estoque ?? 0),
      categoria: p.categoria || "",
      imagem: p.imagem || null,
    };
  } catch (error: any) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
}
