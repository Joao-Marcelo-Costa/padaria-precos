import "./main.css";
import "./style.css";
import { listarProdutos, criarReceita } from "../src/api.js";
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
};

function resetarJanelaAdicionarReceitas() {
  tabelaInsumosReceita.innerHTML = "";
  inputNomeDaReceita.value = "";
  receitaAtual = { nome: "", insumos: [] };
}

btAdicionarReceita.addEventListener("click", () => {
  janelaAdicionarReceita.showModal();
  receitaAtual = {
    nome: "",
    insumos: [],
  };
});

const botaoFechar = document.querySelector(".close_button");

botaoFechar.addEventListener("click", () => {
  resetarJanelaAdicionarReceitas();
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
    };
  }

  const tdQuantidadeInsumoInput = document.createElement("td");
  const quantidadeInsumoInput = document.createElement("input");
  quantidadeInsumoInput.addEventListener("change", () => {
    if (quantidadeInsumoInput.value.length > 0) {
      quantidadeInsumoInput.style.width = `${quantidadeInsumoInput.value.length + 2}ch`;
      quantidadeInsumoInput.style.textAlign = "center";
    } else {
      quantidadeInsumoInput.style.width = "";
      quantidadeInsumoInput.style.textAlign = "left";
    }
    quantidadeInsumoInput.classList.remove("input_invalido");
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

  const tdInsumeDeleteButton = document.createElement("td");
  const insumeDeleteButton = document.createElement("button");
  tdInsumeDeleteButton.appendChild(insumeDeleteButton);
  insumeDeleteButton.classList.add("delete_insume_button");

  const insumeDeleteButtonImg = document.createElement("img");
  insumeDeleteButton.appendChild(insumeDeleteButtonImg);
  insumeDeleteButtonImg.src = "../public/delete_icon.png";
  insumeDeleteButton.addEventListener("click", () => {
    trInsumo.remove();
  });

  trInsumo.appendChild(tdSelectInsumo);
  trInsumo.appendChild(tdQuantidadeInsumoInput);
  trInsumo.appendChild(tdPreçoPorQuantidade);
  trInsumo.appendChild(tdPreçoTotal);
  trInsumo.appendChild(tdInsumeDeleteButton);

  tabelaInsumosReceita.appendChild(trInsumo);

  atualizarInsumo.call(selectNovoInsumo);
  quantidadeInsumoInput.addEventListener("change", () => {
    atualizarInsumo.call(selectNovoInsumo);
    quantidadeInsumoInput.classList.remove("input_invalido");
  });
  selectNovoInsumo.onchange = atualizarInsumo;
});

btCancelar.addEventListener("click", () => {
  //tô vendo que vai dar trabalho então termino depois de fazer a parte de salvar receitas
  resetarJanelaAdicionarReceitas();
  janelaAdicionarReceita.close();
});

inputNomeDaReceita.addEventListener("input", () => {
  inputNomeDaReceita.classList.remove("input_invalido");
});

btSalvar.addEventListener("click", async () => {
  let valid_insume = true;

  if (!inputNomeDaReceita.value.trim()) {
    inputNomeDaReceita.classList.add("invalid_input");
    valid_insume = false;
  } else {
    inputNomeDaReceita.classList.remove("invalid_input");
  }
  if (receitaAtual.insumos.length === 0) {
    valid_insume = false;
  } else {
    tabelaInsumosReceita
      .querySelectorAll(".quantidade_insumo_input")
      .forEach((input) => {
        if (!input.value || Number(input.value) <= 0) {
          input.classList.add("invalid_input");
          valid_insume = false;
        } else {
          input.classList.remove("invalid_input");
        }
      });
  }

  if (!valid_insume) return;
  try {
    receitaAtual.nome = inputNomeDaReceita.value.trim();
    await criarReceita(receitaAtual);
    resetarJanelaAdicionarReceitas();
    janelaAdicionarReceita.close();
  } catch (error) {
    console.error("Erro ao salvar:", erro);
    alert("Erro ao salvar a receita, tente novamente.");
  }
});
