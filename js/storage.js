'use strict';

/* Persistir únicamente el historial de partidas completas. */
var errorAlmacenamiento = '';

function leerHistorial(clave) {
    errorAlmacenamiento = '';
    try {
        var datos = JSON.parse(localStorage.getItem(clave) || '[]');
        if (!Array.isArray(datos)) {
            throw new Error('Formato de historial inválido');
        }
        return datos;
    } catch (error) {
        errorAlmacenamiento = 'No se pudo leer el historial guardado.';
        return [];
    }
}

function escribirHistorial(clave, ranking) {
    errorAlmacenamiento = '';
    try {
        localStorage.setItem(clave, JSON.stringify(ranking));
        return true;
    } catch (error) {
        errorAlmacenamiento = 'No se pudo guardar el resultado en este navegador.';
        return false;
    }
}

function eliminarHistorial(clave) {
    errorAlmacenamiento = '';
    try {
        localStorage.removeItem(clave);
        return true;
    } catch (error) {
        errorAlmacenamiento = 'No se pudo borrar el historial en este navegador.';
        return false;
    }
}
