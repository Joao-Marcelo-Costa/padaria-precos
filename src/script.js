import "./style.css";
import "./main.css";

const btAdicionarReceita = document.querySelector(".button_add_recepies");
const janelaAdicionarReceita = document.querySelector(".add_recepie_window");

btAdicionarReceita.addEventListener("click", () => {
  janelaAdicionarReceita.showModal();
});

const botaoFechar = document.querySelector(".close_button");

botaoFechar.addEventListener("click", () => {
  janelaAdicionarReceita.close();
});