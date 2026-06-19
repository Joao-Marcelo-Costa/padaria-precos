import "./style.css";
import "./main.css";
import { listarProdutos } from "../src/api.js";
import { query } from "firebase/firestore";

const btAdicionarReceita = document.querySelector(".button_add_recepies");
const janelaAdicionarReceita = document.querySelector(".add_recepie_window");
const tabelaInsumosReceita = document.querySelector(".add_insume_table");
const btAdicionarInsumoNaReceita = document.querySelector(".add_insume_button");
const listaDeInsumos = await listarProdutos();

btAdicionarReceita.addEventListener("click", () => {
  janelaAdicionarReceita.showModal();
});

const botaoFechar = document.querySelector(".close_button");

botaoFechar.addEventListener("click", () => {
  janelaAdicionarReceita.close();
});

btAdicionarInsumoNaReceita.addEventListener("click", () => {
  const linhaSelectNovoInsumo = document.createElement("td");
  const selectNovoInsumo = document.createElement("select");
  linhaSelectNovoInsumo.appendChild(selectNovoInsumo);

  listaDeInsumos.forEach((insumo) => {
    console.log(insumo);
    const optionInsumos = document.createElement("option");
    optionInsumos.value = insumo.id;
    optionInsumos.textContent = insumo.nome;
    selectNovoInsumo.appendChild(optionInsumos);
  });
  tabelaInsumosReceita.appendChild(linhaSelectNovoInsumo);

  const linhaQuantidadeInsumoInput = document.createElement("td");
  const quantidadeInsumoInput = document.createElement("input");
  linhaQuantidadeInsumoInput.appendChild(quantidadeInsumoInput);
  quantidadeInsumoInput.placeholder = "quantidade";

  const linhaPreçoPorQuantidade = document.createElement("td");
  const preçoPorQuantidade = document.createElement("p");
  preçoPorQuantidade.innerText = `${insumo.preçoPorQuantidade}`;
  linhaPreçoPorQuantidade.appendChild(preçoPorQuantidade);
  tabelaInsumosReceita.appendChild(linhaPreçoPorQuantidade);
  tabelaInsumosReceita.appendChild(linhaQuantidadeInsumoInput);
});
