'use strict';


/* =========================================
   VALIDAR NOMBRE
   ========================================= */

function validarNombre(nombre) {

    return nombre.trim().length >= 3;

}


/* =========================================
   MOSTRAR ERROR
   ========================================= */

function mostrarError(
    elemento,
    mensaje
) {

    elemento.textContent =
        mensaje;

}


/* =========================================
   LIMPIAR ERROR
   ========================================= */

function limpiarError(elemento) {

    elemento.textContent = '';

}