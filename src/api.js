import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export async function listarProdutos() {
  const snapshot = await getDocs(collection(db, "produtos")); //acessa a coleção produtos dentro do bando de dados db

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(), //retorna os documentos já colocados lá
  }));
}

export async function criarProduto(produto) {
  const docRef = await addDoc(collection(db, "produtos"), produto);

  return {
    ...produto,
    id: docRef.id,
  };
}

export async function excluirProduto(id) {
  await deleteDoc(doc(db, "produtos", id));
}

export async function editarProduto(id, produto) {
  const produtoRef = doc(db, "produtos", id);

  await updateDoc(produtoRef, produto);
}

export async function criarReceita(receita) {
  const docRef = await addDoc(collection(db, "receitas"), receita);

  return docRef.id;
}

export async function buscarReceitas() {
  const snapshot = await getDocs(collection(db, "receitas"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function editarReceita(id, dados) {
  await updateDoc(doc(db, "receitas", id), dados);
}
