/**
 * Aquí estará la lógica principal de la aplicación.
 * Este bloque de código contiene la funcionalidad principal
 * que define el comportamiento del programa.
 */
import { stays } from "./stays.js";
import {
  configurarAutocompletado,
  configurarModal,
  renderizarCards,
  configurarContadorGuests,
} from "./utils.js";

window.stays = stays;

renderizarCards(stays);
configurarModal();
configurarAutocompletado(stays);
configurarContadorGuests();

const toggleBtn = document.getElementById("toggle-dark");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
