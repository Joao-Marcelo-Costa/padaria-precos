import "../src/materia-prima.css";
import "../src/style.css";
import {
  listarProdutos,
  criarProduto,
  excluirProduto,
  editarProduto,
} from "../src/api.js";
import { query } from "firebase/firestore";

const addButton = document.querySelector("#add_button");
const formularioAdicionarInsumo = document.querySelector(
  "#formularioAdicionarInsumo",
);
const botaoCancelar = document.querySelector("#botaoCancelar");
const corpoDaTabela = document.querySelector(".table_body");

function adicionarInsumoNaTela(objetoInsumo) {
  const corpoDaTabela = document.querySelector(".table_body");
  let tr = document.createElement("tr");
  tr.dataset.id = objetoInsumo.id;

  const tdNome = document.createElement("td");
  tdNome.innerHTML = `${objetoInsumo.nome}`;
  tr.append(tdNome);

  const tdUnidade = document.createElement("td");
  tdUnidade.innerHTML = `${objetoInsumo.unidade}`;
  tr.append(tdUnidade);

  const tdValorTotal = document.createElement("td");
  tdValorTotal.innerHTML = `${objetoInsumo.valorTotal}`;
  tr.append(tdValorTotal);

  const tdquantidadePorEmbalagem = document.createElement("td");
  tdquantidadePorEmbalagem.innerHTML = `${objetoInsumo.quantidadePorEmbalagem}`;
  tr.append(tdquantidadePorEmbalagem);

  const tdValorFracionado = document.createElement("td");
  tdValorFracionado.innerHTML = `${objetoInsumo.valorFracionado}R$/${objetoInsumo.unidade}`;
  tr.append(tdValorFracionado);

  const tdButtons = document.createElement("td");

  const botaoEditar = document.createElement("button");
  botaoEditar.innerHTML =
    '<img src="/public/edit_icon.png" alt="botão de editar" />';

  function editarInsumo() {
    tr.classList.add("formularioTr");
    tdNome.innerHTML = `<input value = ${tdNome.textContent} type="text" id="nome" required />`;

    tdUnidade.innerHTML = `
     <select value="${tdUnidade.textContent}" id="unidade" required>
        <option>UN</option>
        <option>Kg</option>
        <option>g</option>
        <option>100g</option>
        <option>L</option>
        <option>mL</option>
      </select>`;

    tdValorTotal.innerHTML = `<input type="number" id="valorTotal" value="${tdValorTotal.textContent}" required/>`;

    tdquantidadePorEmbalagem.innerHTML = `<input type="number" id="quantidade" value="${tdquantidadePorEmbalagem.innerHTML}" "required/>`;

    const campos = [
      tdNome.querySelector("input"),
      tdUnidade.querySelector("select"),
      tdValorTotal.querySelector("input"),
      tdquantidadePorEmbalagem.querySelector("input"),
    ];

    configurarNavegacaoPorEnter(campos, fecharEdicao);
    campos[0].focus();

    async function fecharEdicao() {
      const produtoEditado = {
        nome: campos[0].value,
        unidade: campos[1].value,
        valorTotal: Number(campos[2].value),
        quantidadePorEmbalagem: Number(campos[3].value),
      };

      const id = tr.dataset.id;

      await editarProduto(id, produtoEditado);

      tdNome.innerHTML = `${campos[0].value}`;
      tdUnidade.innerHTML = `${campos[1].value}`;
      tdValorTotal.innerHTML = `${campos[2].value}`;
      tdquantidadePorEmbalagem.innerHTML = `${campos[3].value}`;
      tr.classList.remove("formularioTr");
      botaoEditar.onclick = editarInsumo;
    }

    botaoEditar.onclick = fecharEdicao;
  }

  botaoEditar.onclick = editarInsumo;

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

function configurarNavegacaoPorEnter(campos, callbackFinal) {
  campos.forEach((campo, indice) => {
    campo.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      e.preventDefault();

      const proximoCampo = campos[indice + 1];

      if (proximoCampo) {
        proximoCampo.focus();
      } else {
        callbackFinal();
      }
    });
  });
}

async function carregarInsumos() {
  corpoDaTabela.innerHTML = "";
  const listaDeInsumos = await listarProdutos();
  listaDeInsumos.forEach((e) => {
    adicionarInsumoNaTela(e);
  });
}

document.addEventListener("DOMContentLoaded", carregarInsumos);

function abrirFormulário() {
  const tbody = document.querySelector("tbody");
  if (tbody.querySelector(".formularioTr")) {
    tbody.querySelector(".formularioTr").remove();
    return;
  }
  const formularioTr = document.createElement("tr");
  formularioTr.classList.add("formularioTr");

  formularioTr.innerHTML = `
  <td>
    <input type="text" id="nome" placeholder="Nome do insumo" required />
  </td>
  <td>
      <select id="unidade" required>
        <option>UN</option>
        <option>Kg</option>
        <option>g</option>
        <option>100g</option>
        <option>L</option>
        <option>mL</option>
    </select>
  </td>
  <td>
    <input type="number"id="valorTotal" placeholder="EX: R$0,00" required/>
  </td>
  <td>
    <input type="number" id="quantidade" placeholder="Qnt/Emb " required/>
  </td>
  <td>
    <button id="botaoCancelar" type="button">Cancelar</button>
  </td>
  <td>
    <button id="botaoSalvar" type="submit">Salvar</button>
  </td>`;

  let inputNome = formularioTr.querySelector("#nome");
  let inputUnidade = formularioTr.querySelector("#unidade");
  let inputValorTotal = formularioTr.querySelector("#valorTotal");
  let inputQuantidadePorEmbalagem = formularioTr.querySelector("#quantidade");

  const campos = [
    inputNome,
    inputUnidade,
    inputValorTotal,
    inputQuantidadePorEmbalagem,
  ];

  configurarNavegacaoPorEnter(
    campos,
    document.getElementById("botaoSalvar").click(),
  );

  formularioTr.querySelector("#botaoCancelar").addEventListener("click", () => {
    formularioTr.remove();
    inputNome.value = null;
    inputUnidade.value = "UN";
    inputValorTotal.value = null;
    inputQuantidadePorEmbalagem = null;
  });
  formularioTr
    .querySelector("#botaoSalvar")
    .addEventListener("click", async (e) => {
      const valorTotal = parseFloat(
        inputValorTotal.value.replace(",", ".").replace(/[^\d.]/g, ""),
      );

      const quantidadePorEmbalagem = parseFloat(
        inputQuantidadePorEmbalagem.value
          .replace(",", ".")
          .replace(/[^\d.]/g, ""),
      );

      if (
        !inputNome.value.trim() ||
        isNaN(valorTotal) ||
        isNaN(quantidadePorEmbalagem)
      ) {
        return;
      }

      formularioTr.remove();
      e.preventDefault();
      let produtoParaCriar = {
        nome: inputNome.value,
        unidade: inputUnidade.value,
        valorTotal: Number(valorTotal.toFixed(2)),
        quantidadePorEmbalagem: Number(quantidadePorEmbalagem.toFixed(2)),
        valorFracionado: Number(
          (valorTotal.toFixed(2) / quantidadePorEmbalagem.toFixed(2)).toFixed(
            2,
          ),
        ),
      };
      await criarProduto(produtoParaCriar);
      adicionarInsumoNaTela(produtoParaCriar);
    });
  tbody.appendChild(formularioTr);
  inputNome.focus();
}

addButton.addEventListener("click", (e) => {
  e.stopPropagation();
  abrirFormulário();
});

botaoCancelar.addEventListener("click", (e) => {
  e.preventDefault();
  abrirFormulário();
});
