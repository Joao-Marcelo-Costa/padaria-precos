import "../src/style.css";
import { listarProdutos, criarProduto, excluirProduto } from "../src/api.js";

const addButton = document.querySelector("#add_button");
const formularioAdicionarInsumo = document.querySelector(
  "#formularioAdicionarInsumo",
);
const inputNome = document.querySelector("#nome");
const inputUnidade = document.querySelector("#unidade");
const inputValorTotal = document.querySelector("#valorTotal");
const inputQuantidadePorEmbalagem = document.querySelector("#quantidade");
const botaoCancelar = document.querySelector("#botaoCancelar");
const corpoDaTabela = document.querySelector(".table_body");

function adicionarInsumoNaTela(objetoInsumo) {
  const corpoDaTabela = document.querySelector(".table_body");
  let linha = document.createElement("tr");
  linha.innerHTML = `
  <td>${objetoInsumo.nome}</td>
  <td>${objetoInsumo.unidade}</td>
  <td>R$${objetoInsumo.valorTotal},00</td>
  <td>${objetoInsumo.quantidadePorEmbalagem}</td>
  <td>${objetoInsumo.valorTotal / objetoInsumo.quantidadePorEmbalagem}R$/${objetoInsumo.unidade}</td>
  <td></td>`;
  corpoDaTabela.appendChild(linha);
}

async function carregarInsumos() {
  corpoDaTabela.innerHTML = "";
  const listaDeInsumos = await listarProdutos();
  listaDeInsumos.forEach((e) => {
    adicionarInsumoNaTela(e);
  });
}

document.addEventListener("DOMContentLoaded", carregarInsumos);

function fecharOuAbrirFormulário() {
  inputNome.value = "";
  inputUnidade.value = "UN";
  inputValorTotal.value = "";
  inputQuantidadePorEmbalagem.value = "";
  formularioAdicionarInsumo.classList.toggle("hidden");
}

addButton.addEventListener("click", () => {
  fecharOuAbrirFormulário();
});

botaoCancelar.addEventListener("click", (e) => {
  e.preventDefault();
  fecharOuAbrirFormulário();
});

formularioAdicionarInsumo.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("formulario enviado");
  let produtoParaCriar = {
    nome: inputNome.value,
    unidade: inputUnidade.value,
    valorTotal: parseFloat(
      inputValorTotal.value.replace(",", ".").replace(/[^\d.]/g, ""),
    ),
    quantidadePorEmbalagem: parseFloat(
      inputQuantidadePorEmbalagem.value
        .replace(",", ".")
        .replace(/[^\d.]/g, ""),
    ),
  };
  criarProduto(produtoParaCriar);
  fecharOuAbrirFormulário();
  adicionarInsumoNaTela(produtoParaCriar);
  corpoDaTabela.appendChild(linha);
});
