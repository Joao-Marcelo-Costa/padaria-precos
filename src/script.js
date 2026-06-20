import "./main.css";
import "./style.css";
import { listarProdutos } from "../src/api.js";
import { query } from "firebase/firestore";

const btAdicionarReceita = document.querySelector(".button_add_recepies");
const janelaAdicionarReceita = document.querySelector(".add_recepie_window");
const tabelaInsumosReceita = document.querySelector(".add_insume_table");
const btAdicionarInsumoNaReceita = document.querySelector(".add_insume_button");
const listaDeInsumos = await listarProdutos();
let insumoSelecionadoId = "";

btAdicionarReceita.addEventListener("click", () => {
  janelaAdicionarReceita.showModal();
});

const botaoFechar = document.querySelector(".close_button");

botaoFechar.addEventListener("click", () => {
  janelaAdicionarReceita.close();
});

btAdicionarInsumoNaReceita.addEventListener("click", () => {
  const tdSelectNovoInsumo = document.createElement("td");
  const selectNovoInsumo = document.createElement("select");
  tdSelectNovoInsumo.appendChild(selectNovoInsumo);

  listaDeInsumos.forEach((insumo) => {
    const optionInsumos = document.createElement("option");
    optionInsumos.value = insumo.id;
    optionInsumos.textContent = insumo.nome;
    selectNovoInsumo.appendChild(optionInsumos);
  });

  selectNovoInsumo.onchange = function () {
    let insumoSelecionadoId = this.value;
    let insumoSelecionado = listaDeInsumos.find(
      (elemento) => elemento.id === insumoSelecionadoId,
    );
    preçoPorQuantidade.innerText = `${insumoSelecionado.valorFracionado}R$/${insumoSelecionado.unidade}`;
  };

  const tdQuantidadeInsumoInput = document.createElement("td");
  const quantidadeInsumoInput = document.createElement("input");
  quantidadeInsumoInput.placeholder = "quantidade";
  tdQuantidadeInsumoInput.appendChild(quantidadeInsumoInput);

  const tdPreçoPorQuantidade = document.createElement("td");
  const preçoPorQuantidade = document.createElement("p");
  tdPreçoPorQuantidade.appendChild(preçoPorQuantidade);

  tabelaInsumosReceita.appendChild(tdSelectNovoInsumo);
  tabelaInsumosReceita.appendChild(tdQuantidadeInsumoInput);
  tabelaInsumosReceita.appendChild(tdPreçoPorQuantidade);
});
