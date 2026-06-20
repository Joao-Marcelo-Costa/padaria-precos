import "./main.css";
import "./style.css";
import { listarProdutos } from "../src/api.js";
import { query } from "firebase/firestore";

const btAdicionarReceita = document.querySelector(".button_add_recepies");
const janelaAdicionarReceita = document.querySelector(".add_recepie_window");
const tabelaInsumosReceita = document.querySelector(".add_insume_table_tbody");
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
  const trInsumo = document.createElement("tr");
  const tdSelectInsumo = document.createElement("td");
  const selectNovoInsumo = document.createElement("select");
  tdSelectInsumo.appendChild(selectNovoInsumo);

  listaDeInsumos.forEach((insumo) => {
    const optionInsumos = document.createElement("option");
    optionInsumos.value = insumo.id;
    optionInsumos.textContent = insumo.nome;
    selectNovoInsumo.appendChild(optionInsumos);
  });

  function pergarPropiedadesElementoInsumo() {
    let insumoSelecionadoId = this.value;
    let insumoSelecionado = listaDeInsumos.find(
      (elemento) => elemento.id === insumoSelecionadoId,
    );
    preçoPorQuantidade.innerText = `${insumoSelecionado.valorFracionado}R$/${insumoSelecionado.unidade}`;
    quantidadeInsumoInput.placeholder = `quantidade em ${insumoSelecionado.unidade}`;

    preçoTotal.innerText = `R$${insumoSelecionado.valorFracionado * quantidadeInsumoInput.value}`;
  }

  const tdQuantidadeInsumoInput = document.createElement("td");
  const quantidadeInsumoInput = document.createElement("input");
  tdQuantidadeInsumoInput.appendChild(quantidadeInsumoInput);

  const tdPreçoPorQuantidade = document.createElement("td");
  const preçoPorQuantidade = document.createElement("p");
  tdPreçoPorQuantidade.appendChild(preçoPorQuantidade);

  const tdPreçoTotal = document.createElement("td");
  const preçoTotal = document.createElement("p");
  tdPreçoTotal.appendChild(preçoTotal);

  trInsumo.appendChild(tdSelectInsumo);
  trInsumo.appendChild(tdQuantidadeInsumoInput);
  trInsumo.appendChild(tdPreçoPorQuantidade);
  trInsumo.appendChild(tdPreçoTotal);

  tabelaInsumosReceita.appendChild(trInsumo);

  pergarPropiedadesElementoInsumo.call(selectNovoInsumo);
  quantidadeInsumoInput.addEventListener("change", () => {
    pergarPropiedadesElementoInsumo.call(selectNovoInsumo);
  });
  selectNovoInsumo.onchange = pergarPropiedadesElementoInsumo;
});
