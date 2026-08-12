'use strict';


/* =========================================
   GUARDAR DATOS DE LA PARTIDA
   ========================================= */

function guardarPartida(partida) {

    localStorage.setItem(
        'partidaActual',
        JSON.stringify(partida)
    );

}


/* =========================================
   OBTENER PARTIDA
   ========================================= */

function obtenerPartida() {

    const partidaGuardada =
        localStorage.getItem('partidaActual');

    if (partidaGuardada === null) {

        return null;

    }

    return JSON.parse(partidaGuardada);

}


/* =========================================
   ELIMINAR PARTIDA
   ========================================= */

function eliminarPartida() {

    localStorage.removeItem('partidaActual');

}