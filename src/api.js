import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export async function listarProdutos() {
  const snapshot = await getDocs(collection(db, "produtos")); //acessa a coleção produtos dentro do bando de dados db

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(), //retorna os documentos já colocados lá
  }));
}

export async function criarProduto(produto) {
  await addDoc(collection(db, "produtos"), produto);
}

export async function excluirProduto(id) {
  await deleteDoc(doc(db, "produtos", id));
}
