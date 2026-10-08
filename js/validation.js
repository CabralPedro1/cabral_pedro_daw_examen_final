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

/* Contacto tiene reglas propias; el nombre del jugador conserva su validación. */
function validarNombreContacto(nombre) {
    return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+$/.test(nombre.trim());
}

function validarEmail(email) {
    return /^[A-Za-z0-9_+%-]+(?:\.[A-Za-z0-9_+%-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(email.trim());
}

function validarMensaje(mensaje) {
    return mensaje.trim().length > 5;
}
