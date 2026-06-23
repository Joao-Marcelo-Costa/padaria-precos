import "./main.css";
import "./style.css";
import { listarProdutos } from "../src/api.js";
import { doc, query } from "firebase/firestore";

const inputNomeDaReceita = document.querySelector(".add_recepie_name");
const btAdicionarReceita = document.querySelector(".button_add_recepies");
const janelaAdicionarReceita = document.querySelector(".add_recepie_window");
const tabelaInsumosReceita = document.querySelector(".add_insume_table_tbody");
const btAdicionarInsumoNaReceita = document.querySelector(".add_insume_button");
const listaDeInsumos = await listarProdutos();
const btCancelar = document.querySelector(".cancel_button");
const btSalvar = document.querySelector(".save_button");
let insumoSelecionadoId = "";
let receitaAtual = {
  nome: "",
  insumos: [],
  valor_inicial: 0,
  valor_final: 0,
};

btAdicionarReceita.addEventListener("click", () => {
  janelaAdicionarReceita.showModal();
  receitaAtual = {
    nome: "",
    insumos: [],
  };
});

const botaoFechar = document.querySelector(".close_button");

botaoFechar.addEventListener("click", () => {
  janelaAdicionarReceita.close();
});

btAdicionarInsumoNaReceita.addEventListener("click", () => {
  const indexInsumoAtual = receitaAtual.insumos.length;
  receitaAtual.insumos.push({});

  const trInsumo = document.createElement("tr");
  const tdSelectInsumo = document.createElement("td");
  const selectNovoInsumo = document.createElement("select");
  tdSelectInsumo.classList.add("td_insume_selector");
  tdSelectInsumo.appendChild(selectNovoInsumo);

  listaDeInsumos.forEach((insumo) => {
    const optionInsumos = document.createElement("option");
    optionInsumos.value = insumo.id;
    optionInsumos.textContent = insumo.nome;
    selectNovoInsumo.appendChild(optionInsumos);
  });

  function atualizarInsumo() {
    const insumoSelecionadoId = this.value;
    const insumoSelecionado = listaDeInsumos.find(
      (elemento) => elemento.id === insumoSelecionadoId,
    );

    preçoPorQuantidade.innerText = `${insumoSelecionado.valorFracionado}R$/${insumoSelecionado.unidade}`;
    quantidadeInsumoInput.placeholder = `quantidade em ${insumoSelecionado.unidade}`;
    preçoTotal.innerText = `R$${insumoSelecionado.valorFracionado * quantidadeInsumoInput.value}`;
    let indexInsumo = 0;
    receitaAtual.insumos[indexInsumoAtual] = {
      idInsumo: insumoSelecionadoId,
      nome: insumoSelecionado.nome,
      quantidade: Number(quantidadeInsumoInput.value),
      valorFracionado: insumoSelecionado.valorFracionado,
      valorTotal:
        insumoSelecionado.valorFracionado * Number(quantidadeInsumoInput.value),
    };
  }

  const tdQuantidadeInsumoInput = document.createElement("td");
  const quantidadeInsumoInput = document.createElement("input");
  quantidadeInsumoInput.addEventListener("change", () => {
    debugger;
    if (quantidadeInsumoInput.value.length > 0) {
      quantidadeInsumoInput.style.width = `${quantidadeInsumoInput.value.length + 2}ch`;
      quantidadeInsumoInput.style.textAlign = "center";
    } else {
      quantidadeInsumoInput.style.width = "";
      quantidadeInsumoInput.style.textAlign = "left";
    }
  });

  quantidadeInsumoInput.classList.add("quantidade_insumo_input");
  tdQuantidadeInsumoInput.appendChild(quantidadeInsumoInput);

  const tdPreçoPorQuantidade = document.createElement("td");
  const preçoPorQuantidade = document.createElement("p");
  tdPreçoPorQuantidade.appendChild(preçoPorQuantidade);

  const tdPreçoTotal = document.createElement("td");
  const preçoTotal = document.createElement("p");
  preçoTotal.classList.add("preçoTotal_text");
  tdPreçoTotal.appendChild(preçoTotal);

  trInsumo.appendChild(tdSelectInsumo);
  trInsumo.appendChild(tdQuantidadeInsumoInput);
  trInsumo.appendChild(tdPreçoPorQuantidade);
  trInsumo.appendChild(tdPreçoTotal);

  tabelaInsumosReceita.appendChild(trInsumo);

  atualizarInsumo.call(selectNovoInsumo);
  quantidadeInsumoInput.addEventListener("change", () => {
    atualizarInsumo.call(selectNovoInsumo);
  });
  selectNovoInsumo.onchange = atualizarInsumo;
});

btCancelar.addEventListener("click", () => {
  //tô vendo que vai dar trabalho então termino depois de fazer a parte de salvar receitas
  janelaAdicionarReceita.close();
});

btSalvar.addEventListener("click", () => {
  receitaAtual.nome = inputNomeDaReceita.value;
  receitaAtual.valor_total = receitaAtual.insumos.reduce(
    (acumulador, insumo) => acumulador + (insumo.valorTotal ?? 0),
    0,
  );
  console.log(receitaAtual);
});
