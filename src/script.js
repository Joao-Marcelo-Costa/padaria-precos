import "./main.css";
import "./style.css";
import {
  listarProdutos,
  criarReceita,
  buscarReceitas,
  deletarReceita,
  buscarReceitaPorId,
} from "../src/api.js";
import { doc, query } from "firebase/firestore";

const inputNomeDaReceita = document.querySelector(".add_recepie_name");
const inputUnidadeDaReceita = document.querySelector(".add_recepie_unity");
const inputRendimentoDaReceita = document.querySelector(".add_recipie_amount");
const btAdicionarReceita = document.querySelector(".button_add_recepies");
const janelaAdicionarReceita = document.querySelector(".add_recepie_window");
const tabelaInsumosReceita = document.querySelector(".add_insume_table_tbody");
const btAdicionarInsumoNaReceita = document.querySelector(".add_insume_button");
let listaDeInsumos = await listarProdutos();
const btCancelar = document.querySelector(".cancel_button");
const btSalvar = document.querySelector(".save_button");
const listaDeReceitas = await buscarReceitas();
const sectionReceitas = document.querySelector(".section_table");
const tituloDialog = document.querySelector(".dialog_title");

let insumoSelecionadoId = "";
let receitaAtual = {
  nome: "",
  insumos: [],
};

function resetarJanelaAdicionarReceitas() {
  inputNomeDaReceita.value = "";
  inputUnidadeDaReceita.value = "UN";
  tabelaInsumosReceita.innerHTML = "";
  receitaAtual = { nome: "", insumos: [] };
}

async function atualizarSelectInsumos(select) {
  const listaDeInsumosNova = await listarProdutos();

  let selectValorInicial = null;
  if (select.value) {
    selectValorInicial = select.value;
  } else {
    selectValorInicial = listaDeInsumosNova[0].id;
  }

  select.innerHTML = "";

  listaDeInsumosNova.forEach((insumo) => {
    const optionInsumos = document.createElement("option");
    optionInsumos.value = insumo.id;
    optionInsumos.textContent = insumo.nome;

    select.appendChild(optionInsumos);
  });

  select.value = selectValorInicial;
}

async function adcionarInsumoNaReceita(insumoParaAdicionar) {
  const indexInsumoAtual = receitaAtual.insumos.length;
  receitaAtual.insumos.push({});

  const trInsumo = document.createElement("tr");
  const tdSelectInsumo = document.createElement("td");
  const selectNovoInsumo = document.createElement("select");
  selectNovoInsumo.classList.add("insume_selector");
  tdSelectInsumo.classList.add("td_insume_selector");
  tdSelectInsumo.appendChild(selectNovoInsumo);

  await atualizarSelectInsumos(selectNovoInsumo);

  async function atualizarInsumo() {
    const listaDeInsumosNova = await listarProdutos();
    const insumoSelecionadoId = this.value;
    const insumoSelecionado = listaDeInsumosNova.find(
      (elemento) => elemento.id === insumoSelecionadoId,
    );

    preçoPorQuantidade.innerText = `${insumoSelecionado.valorFracionado}R$/${insumoSelecionado.unidade}`;
    quantidadeInsumoInput.placeholder = `quantidade em ${insumoSelecionado.unidade}`;
    preçoTotal.innerText = `R$${insumoSelecionado.valorFracionado * quantidadeInsumoInput.value}`;
    let indexInsumo = 0;
    receitaAtual.insumos[indexInsumoAtual] = {
      id: insumoSelecionadoId,
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
  insumeDeleteButtonImg.alt = "botão de deletar insumo";
  insumeDeleteButton.addEventListener("click", () => {
    receitaAtual.insumos.splice(indexInsumoAtual, 1);
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
    quantidadeInsumoInput.classList.remove("invalid_input");
  });
  selectNovoInsumo.onchange = atualizarInsumo;

  inputs.push(selectNovoInsumo);
  inputs.push(quantidadeInsumoInput);
  inputs.push(btAdicionarInsumoNaReceita);

  selectNovoInsumo.addEventListener("keydown", (e) =>
    navegarPorEnter(e, selectNovoInsumo),
  );
  quantidadeInsumoInput.addEventListener("keydown", (e) =>
    navegarPorEnter(e, quantidadeInsumoInput),
  );

  if (insumoParaAdicionar) {
    selectNovoInsumo.value = insumoParaAdicionar.id;
    quantidadeInsumoInput.value = insumoParaAdicionar.quantidade;
  }
}

btAdicionarReceita.addEventListener("click", () => {
  tituloDialog.innerHTML = "Adicionar receita";
  janelaAdicionarReceita.showModal();
  receitaAtual = {
    nome: "",
    insumos: [],
  };
  inputNomeDaReceita.focus();
});

const botaoFechar = document.querySelector(".close_button");

botaoFechar.addEventListener("click", () => {
  resetarJanelaAdicionarReceitas();
  janelaAdicionarReceita.close();
});

btAdicionarInsumoNaReceita.addEventListener("click", () => {
  adcionarInsumoNaReceita();
});

window.addEventListener("focus", async () => {
  document.querySelectorAll(".insume_selector").forEach((select) => {
    atualizarSelectInsumos(select);
  });
});

const inputs = [
  inputNomeDaReceita,
  inputUnidadeDaReceita,
  inputRendimentoDaReceita,
  btAdicionarInsumoNaReceita,
];

function navegarPorEnter(e, elemento) {
  if (e.key !== "Enter") return;
  e.preventDefault();

  const indice = inputs.indexOf(elemento);
  const proximoCampo = inputs[indice + 1];
  if (!proximoCampo) return;

  if (proximoCampo.tagName === "BUTTON") {
    proximoCampo.click();
    inputs[indice + 2].focus();
  } else {
    proximoCampo.focus();
  }
}

inputNomeDaReceita.addEventListener("keydown", (e) =>
  navegarPorEnter(e, inputNomeDaReceita),
);
inputUnidadeDaReceita.addEventListener("keydown", (e) =>
  navegarPorEnter(e, inputUnidadeDaReceita),
);
inputRendimentoDaReceita.addEventListener("keydown", (e) =>
  navegarPorEnter(e, inputRendimentoDaReceita),
);

janelaAdicionarReceita.addEventListener("cancel", (e) => {
  e.preventDefault(); // impede o fechamento padrão do dialog
  btCancelar.click();
  tdSelectInsumo.focus();
});

btCancelar.addEventListener("click", () => {
  resetarJanelaAdicionarReceitas();
  janelaAdicionarReceita.close();
});

inputNomeDaReceita.addEventListener("input", () => {
  inputNomeDaReceita.classList.remove("invalid_input");
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
    receitaAtual.unidade = inputUnidadeDaReceita.value;
    receitaAtual.rendimento = inputRendimentoDaReceita.value.trim();
    const novaReceitaId = await criarReceita(receitaAtual);
    const novaReceitaObjeto = await buscarReceitaPorId(novaReceitaId);
    adicionarElementoReceita(novaReceitaObjeto);

    resetarJanelaAdicionarReceitas();
    janelaAdicionarReceita.close();
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao salvar a receita, tente novamente.");
  }
});

function adicionarElementoReceita(objetoReceita) {
  const divReceita = document.createElement("div");
  divReceita.dataset.receitaId = objetoReceita.id;
  divReceita.classList.add("main_recepie_div");
  divReceita.innerHTML = `
    <div class="header_recepie_div">
      <h5>${objetoReceita.nome}</h5>
      <div class="recepie_buttons">
        <button class="delete_recepie_button">
          <img src="../public/delete_icon.png" alt="imagem botão deletar receita">
        </button>
        <button class="edit_recepie_buttton">
          <img src="../public/edit_icon.png" alt="imagem botão editar receita">
        </button>
      </div>
    </div>
    <div class="table_container">
      <table class="recepie_insume_table"></table>
    </div>
  `;
  const tabelaReceita = divReceita.querySelector(".recepie_insume_table");

  const recepieDeleteButton = divReceita.querySelector(
    ".delete_recepie_button",
  );
  recepieDeleteButton.addEventListener("click", () => {
    let confirmação = confirm("deseja memso excluir essa receita ?"); //depois criar algum tipo de aviso mais elaborado pra garantir que o usuàrio não delete sem querer
    if (confirmação) {
      deletarReceita(divReceita.dataset.receitaId);
      divReceita.remove();
    }
  });

  const recepieEditButtton = divReceita.querySelector(".edit_recepie_buttton");
  recepieEditButtton.addEventListener("click", async () => {
    janelaAdicionarReceita.showModal();
    const receitaBuscadaPorId = await buscarReceitaPorId(
      divReceita.dataset.receitaId,
    );
    tituloDialog.innerHTML = "Editar receita";
    inputNomeDaReceita.value = receitaBuscadaPorId.nome;
    inputUnidadeDaReceita.value = receitaBuscadaPorId.unidade;
    inputRendimentoDaReceita.value = receitaBuscadaPorId.rendimento;
    tabelaInsumosReceita.innerHTML = "";
    receitaBuscadaPorId.insumos.forEach((e) => {
      adcionarInsumoNaReceita(e);
    });
  });

  let custoTotalDaReceita = 0;
  objetoReceita.insumos.forEach((insumoDaReceita) => {
    //cria a tabela de insumos dentro das receitas
    let insumoReal = listaDeInsumos.find(
      (insumo) => insumo.id === insumoDaReceita.id,
    );
    let custoDesseInsumo =
      insumoReal.valorFracionado * insumoDaReceita.quantidade;
    custoTotalDaReceita = custoTotalDaReceita + custoDesseInsumo;

    const tdInsumoAtualNome = document.createElement("td");
    tdInsumoAtualNome.innerHTML = `<p class="recipies_insume_name_text">${insumoReal.nome}</p>`;

    const tdInsumoAtualQuantidade = document.createElement("td");
    tdInsumoAtualQuantidade.innerHTML = `<p>${insumoDaReceita.quantidade}${insumoReal.unidade}</p>`;

    const tdInsumoAtualPreço = document.createElement("td");
    tdInsumoAtualPreço.innerHTML = `<p>R$${Number(insumoReal.valorFracionado * insumoDaReceita.quantidade).toFixed(2)}</p>`;

    const trInsumoAtual = document.createElement("tr");
    trInsumoAtual.appendChild(tdInsumoAtualNome);
    trInsumoAtual.appendChild(tdInsumoAtualQuantidade);
    trInsumoAtual.appendChild(tdInsumoAtualPreço);

    tabelaReceita.appendChild(trInsumoAtual);
  });

  const pricesDiv = document.createElement("div");
  pricesDiv.classList.add("prices_div");
  pricesDiv.innerHTML = `
  <p>R$${custoTotalDaReceita.toFixed(2)}</p>
  <p>R$${(custoTotalDaReceita / objetoReceita.rendimento).toFixed(2)}/${objetoReceita.unidade}</p>
  `;
  divReceita.appendChild(pricesDiv);
  sectionReceitas.appendChild(divReceita);
}

listaDeReceitas.forEach((receita) => {
  adicionarElementoReceita(receita);
});
