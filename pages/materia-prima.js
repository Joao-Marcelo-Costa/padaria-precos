import "../src/style.css";
const addButton = document.querySelector("#add_button");
const formularioAdicionarInsumo = document.querySelector(
  "#formularioAdicionarInsumo",
);
const inputNome = document.querySelector("#nome");
const inputUnidade = document.querySelector("#unidade");
const valorTotal = document.querySelector("#valorTotal");
const quantidadePorEmbalagem = document.querySelector("#quantidade");
const botaoCancelar = document.querySelector("#botaoCancelar");

addButton.addEventListener("click", () => {
  formularioAdicionarInsumo.classList.toggle("hidden");
});

botaoCancelar.addEventListener("click", (e) => {
  e.preventDefault();
  inputNome.value = "";
  inputNome.value = "";
  inputNome.value = "";
  formularioAdicionarInsumo.classList.toggle("hidden");
});

formularioAdicionarInsumo.addEventListener("submit", () => {
  ("formulario enviado");
});
