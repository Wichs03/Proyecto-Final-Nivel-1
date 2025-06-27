/**
 * Módulo de funciones utilitarias.
 * Este archivo contiene funciones auxiliares que serán utilizadas y llamadas
 * desde el archivo principal para realizar varias operaciones.
 */
// utils.js

import { starIcon } from "./assets.js";
import { locationIcon } from "./assets.js";

export function renderizarCards(staysArray) {
  const contenedor = document.querySelector(".contenedor");
  const numeroStays = document.querySelector(".numeroStays");

  contenedor.innerHTML = "";

  staysArray.forEach((stay) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${stay.photo}" alt="${stay.title}" />
      <div class="caracteristicas">
        ${stay.superHost ? `<span class="superHost">SUPERHOST</span>` : ""}
        <span class="type">${stay.type}</span>
        <span class="beds">${stay.beds ? stay.beds + " beds" : ""}</span>
        <span class="rating">${starIcon} ${stay.rating}</span>
      </div>
      <h3 class="cardTitle">${stay.title}</h3>
    `;

    contenedor.appendChild(card);
  });

  if (numeroStays) {
    numeroStays.textContent = `${staysArray.length} stays`;
  }
}

export function filtrarStays(stays, location, guests) {
  return stays.filter((stay) => {
    const coincideLocation = location
      ? stay.city?.toLowerCase().includes(location.toLowerCase())
      : true;

    const coincideGuests = guests ? stay.maxGuests >= guests : true;

    return coincideLocation && coincideGuests;
  });
}

export function configurarModal() {
  const modal = document.getElementById("modalFiltros");
  const botonAbrir = document.querySelector(".barra");
  const botonCerrar = document.getElementById("cerrarModal");
  const btnAplicar = document.getElementById("btnAplicar");

  if (!modal || !botonAbrir || !btnAplicar) return;

  botonAbrir.addEventListener("click", () => {
    modal.classList.remove("oculto");
  });

  if (botonCerrar) {
    botonCerrar.addEventListener("click", () => {
      modal.classList.add("oculto");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("oculto");
    }
  });

  btnAplicar.addEventListener("click", () => {
    const inputLocation = document.getElementById("ciudad");
    const inputGuests = document.getElementById("huespedes");

    const location = inputLocation?.value.trim() || "";
    const guests = inputGuests?.value ? Number(inputGuests.value) : null;

    const resultadoFiltrado = filtrarStays(window.stays, location, guests);
    renderizarCards(resultadoFiltrado);
    modal.classList.add("oculto");
  });
}

export function configurarAutocompletado(stays) {
  const inputCiudad = document.getElementById("ciudad");
  const listaSugerencias = document.getElementById("listaSugerencias");

  if (!inputCiudad || !listaSugerencias) return;

  const ciudadesUnicas = [...new Set(stays.map((stay) => stay.city))];

  function mostrarSugerencias(texto) {
    listaSugerencias.innerHTML = "";

    if (texto.trim() === "") {
      listaSugerencias.classList.remove("visible");
      return;
    }

    const filtro = ciudadesUnicas.filter((ciudad) =>
      ciudad.toLowerCase().includes(texto.toLowerCase())
    );

    if (filtro.length === 0) {
      listaSugerencias.classList.remove("visible");
      return;
    }

    filtro.forEach((ciudad) => {
      const li = document.createElement("li");
      li.innerHTML = `${locationIcon} <span>${ciudad}</span>`;
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.gap = "8px";
      li.style.cursor = "pointer";

      li.addEventListener("click", () => {
        inputCiudad.value = ciudad;
        listaSugerencias.classList.remove("visible");
        inputCiudad.focus();
      });

      listaSugerencias.appendChild(li);
    });

    listaSugerencias.classList.add("visible");
  }

  inputCiudad.addEventListener("input", (e) => {
    mostrarSugerencias(e.target.value);
  });

  window.addEventListener("click", (e) => {
    if (
      !inputCiudad.contains(e.target) &&
      !listaSugerencias.contains(e.target)
    ) {
      listaSugerencias.classList.remove("visible");
    }
  });
}

export function configurarContadorGuests() {
  const btnSumar = document.querySelectorAll(".btn-sumar");
  const btnRestar = document.querySelectorAll(".btn-restar");
  const adultCountSpan = document.getElementById("adult-count");
  const childCountSpan = document.getElementById("child-count");
  const inputHuespedes = document.getElementById("huespedes");

  if (
    !btnSumar.length ||
    !btnRestar.length ||
    !adultCountSpan ||
    !childCountSpan ||
    !inputHuespedes
  )
    return;

  let adultos = 1; // mín 1 adulto
  let ninos = 0;

  adultCountSpan.textContent = adultos;
  childCountSpan.textContent = ninos;
  inputHuespedes.value = adultos + ninos;

  function actualizarTotal() {
    const total = adultos + ninos;
    inputHuespedes.value = total;
  }

  btnSumar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tipo = btn.dataset.type;
      if (tipo === "adult") {
        adultos++;
        adultCountSpan.textContent = adultos;
      } else if (tipo === "child") {
        ninos++;
        childCountSpan.textContent = ninos;
      }
      actualizarTotal();
    });
  });

  btnRestar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tipo = btn.dataset.type;
      if (tipo === "adult" && adultos > 1) {
        adultos--;
        adultCountSpan.textContent = adultos;
      } else if (tipo === "child" && ninos > 0) {
        ninos--;
        childCountSpan.textContent = ninos;
      }
      actualizarTotal();
    });
  });
}
