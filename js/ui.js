'use strict';


/* =========================================
   ELEMENTOS DE LA INTERFAZ
   ========================================= */

const pantallaInicial = document.getElementById('pantalla-inicial');
const pantallaJuego = document.getElementById('pantalla-juego');

const formularioInicio = document.getElementById('formulario-inicio');

const nombreJugador = document.getElementById('nombre-jugador');

const errorNombre = document.getElementById('error-nombre');
const errorDificultad = document.getElementById('error-dificultad');

const opcionesDificultad = document.querySelectorAll(
    '.opcion-dificultad'
);

const jugadorActual = document.getElementById('jugador-actual');
const nivelActual = document.getElementById('nivel-actual');


/* =========================================
   DIFICULTAD SELECCIONADA
   ========================================= */

let dificultadSeleccionada = null;


/* =========================================
   SELECCIONAR DIFICULTAD
   ========================================= */

function seleccionarDificultad(opcion) {

    opcionesDificultad.forEach(function (elemento) {
        elemento.classList.remove('seleccionada');
    });

    opcion.classList.add('seleccionada');

    dificultadSeleccionada =
        opcion.dataset.dificultad;

    limpiarError(errorDificultad);
}


/* =========================================
   MOSTRAR PANTALLA DE JUEGO
   ========================================= */

function mostrarPantallaJuego(nombre, dificultad) {

    pantallaInicial.classList.add('oculto');

    pantallaJuego.classList.remove('oculto');

    jugadorActual.textContent = nombre;

    nivelActual.textContent =
        dificultad.charAt(0).toUpperCase() +
        dificultad.slice(1);
}


/* =========================================
   MOSTRAR PANTALLA INICIAL
   ========================================= */

function mostrarPantallaInicial() {

    pantallaJuego.classList.add('oculto');

    pantallaInicial.classList.remove('oculto');
}