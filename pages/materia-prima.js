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

document.addEventListener("DOMContentLoaded", async () => {
  const listaDeInsumos = await listarProdutos();
  listaDeInsumos.forEach((e) => {
    let linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${e.nome}</td>
      <td>${e.unidade}</td>
      <td>R$${e.valorTotal},00</td>
      <td>${e.quantidadePorEmbalagem}</td>
      <td>${e.valorTotal / e.quantidadePorEmbalagem}R$/${e.unidade}</td>
      <td></td>`;
    corpoDaTabela.appendChild(linha);
  });
});

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
  criarProduto({
    nome: inputNome.value,
    unidade: inputUnidade.value,
    valorTotal: inputValorTotal.value.replace(/[^0-9]/g, ""),
    quantidadePorEmbalagem: inputQuantidadePorEmbalagem.value.replace(
      /[^0-9]/g,
      "",
    ),
  });
  fecharOuAbrirFormulário();
});
