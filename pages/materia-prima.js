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
  let tr = document.createElement("tr");
  tr.innerHTML = `
  <td>${objetoInsumo.nome}</td>
  <td>${objetoInsumo.unidade}</td>
  <td>R$${objetoInsumo.valorTotal},00</td>
  <td>${objetoInsumo.quantidadePorEmbalagem}</td>
  <td>${objetoInsumo.valorTotal / objetoInsumo.quantidadePorEmbalagem}R$/${objetoInsumo.unidade}</td>`;

  const tdButtons = document.createElement("td");

  const botaoEditar = document.createElement("button");
  botaoEditar.innerHTML =
    '<img src="/public/edit_icon.png" alt="botão de editar" />';
  botaoEditar.addEventListener("click", () => {}); //vou criar o botão de editar depois de mexer no formulário de adição direito

  const botaoDeletar = document.createElement("button");
  botaoDeletar.innerHTML =
    '<img src="/public/delete_icon.png" alt="botão de deletar" />';
  botaoDeletar.addEventListener("click", () => {
    let confirmação = confirm("deseja memso excluir esse item ?"); //depois criar algum tipo de aviso mais elaborado pra garantir que o usuàrio não delete sem querer
    if (confirmação) {
      tr.remove();
      excluirProduto(objetoInsumo.id);
    }
  });

  tdButtons.appendChild(botaoDeletar);
  tdButtons.appendChild(botaoEditar);
  tr.appendChild(tdButtons);

  corpoDaTabela.appendChild(tr);
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
    valorTotal: Number(
      parseFloat(
        inputValorTotal.value.replace(",", ".").replace(/[^\d.]/g, ""),
      ).toFixed(2),
    ),
    quantidadePorEmbalagem: Number(
      parseFloat(
        inputQuantidadePorEmbalagem.value
          .replace(",", ".")
          .replace(/[^\d.]/g, ""),
      ).toFixed(2),
    ),
  };
  criarProduto(produtoParaCriar);
  fecharOuAbrirFormulário();
  adicionarInsumoNaTela(produtoParaCriar);
  corpoDaTabela.appendChild(linha);
});
