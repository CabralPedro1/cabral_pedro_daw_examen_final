'use strict';


/* =========================================
   ELEMENTOS DE LA INTERFAZ
   ========================================= */

var pantallaInicial = document.getElementById('pantalla-inicial');
var pantallaJuego = document.getElementById('pantalla-juego');

var formularioInicio = document.getElementById('formulario-inicio');

var nombreJugador = document.getElementById('nombre-jugador');

var errorNombre = document.getElementById('error-nombre');
var errorDificultad = document.getElementById('error-dificultad');

var opcionesDificultad = document.querySelectorAll(
    '.opcion-dificultad'
);

var jugadorActual = document.getElementById('jugador-actual');
var nivelActual = document.getElementById('nivel-actual');


/* =========================================
   DIFICULTAD SELECCIONADA
   ========================================= */

var dificultadSeleccionada = null;


/* =========================================
   SELECCIONAR DIFICULTAD
   ========================================= */

function seleccionarDificultad(opcion) {

    Array.prototype.forEach.call(opcionesDificultad,function (elemento) {
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
        obtenerNombreNivel(dificultad);
}


/* =========================================
   MOSTRAR PANTALLA INICIAL
   ========================================= */

function mostrarPantallaInicial() {

    pantallaJuego.classList.add('oculto');

    pantallaInicial.classList.remove('oculto');
}