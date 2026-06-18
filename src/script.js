import "./style.css";
import "./main.css";

const btAdicionarReceita = document.querySelector(".button_add_recepies");
const janelaAdicionarReceita = document.querySelector(".add_recepie_window");

btAdicionarReceita.addEventListener("click", () => {
  janelaAdicionarReceita.showModal();
});
