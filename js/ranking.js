'use strict';


/* =========================================
   CONFIGURACIÓN
   ========================================= */

var CLAVE_RANKING = 'rankingMemotest';


/* =========================================
   OBTENER RANKING
   ========================================= */

function obtenerRanking() {
    return leerHistorial(CLAVE_RANKING).filter(function (resultado) {
        return resultado && typeof resultado.nombre === 'string' &&
            ['facil', 'medio', 'dificil'].indexOf(resultado.nivel) !== -1 &&
            typeof resultado.puntaje === 'number' && isFinite(resultado.puntaje) && resultado.puntaje >= 0 &&
            typeof resultado.duracion === 'number' && isFinite(resultado.duracion) && resultado.duracion >= 0 &&
            typeof resultado.intentos === 'number' && resultado.intentos >= 0 &&
            typeof resultado.errores === 'number' && resultado.errores >= 0 &&
            typeof resultado.fecha === 'string' && !isNaN(Date.parse(resultado.fecha));
    });
}

/* =========================================
   GUARDAR RANKING
   ========================================= */

function guardarRanking(ranking) {

    return escribirHistorial(CLAVE_RANKING, ranking);

}


/* =========================================
   GUARDAR RESULTADO
   ========================================= */

function guardarResultado() {
    if (!estadoJuego.partidaFinalizada || estadoJuego.resultadoGuardado) {
        return;
    }

    var resultado = {

        nombre:
            estadoJuego.nombre,

        puntaje:
            estadoJuego.puntaje,

        nivel:
            estadoJuego.dificultad,

        intentos:
            estadoJuego.intentos,

        errores:
            estadoJuego.errores,

        fecha:
            new Date().toISOString(),

        duracion:
            estadoJuego.segundos

    };


    var ranking =
        obtenerRanking();


    ranking.push(resultado);


    if (errorAlmacenamiento) {
        document.getElementById('aviso-almacenamiento').textContent = errorAlmacenamiento + ' El resultado no se guardó; podés borrar el historial desde Ranking.';
        return;
    }
    estadoJuego.resultadoGuardado = guardarRanking(ranking);
    document.getElementById('aviso-almacenamiento').textContent = errorAlmacenamiento;

}


/* =========================================
   ORDENAR POR PUNTAJE
   ========================================= */

function ordenarPorPuntaje(ranking) {

    ranking.sort(function (a, b) {

        return b.puntaje - a.puntaje;

    });

}


/* =========================================
   ORDENAR POR FECHA
   ========================================= */

function ordenarPorFecha(ranking) {

    ranking.sort(function (a, b) {

        return new Date(b.fecha) -
            new Date(a.fecha);

    });

}


/* =========================================
   ORDENAR POR DURACIÓN
   ========================================= */

function ordenarPorDuracion(ranking) {

    ranking.sort(function (a, b) {

        return a.duracion -
            b.duracion;

    });

}


/* =========================================
   ORDENAR POR NIVEL
   ========================================= */

function ordenarPorNivel(ranking) {

    var valoresNivel = {

        dificil: 3,

        medio: 2,

        facil: 1

    };


    ranking.sort(function (a, b) {

        return valoresNivel[b.nivel] -
            valoresNivel[a.nivel];

    });

}


/* =========================================
   ORDENAR RANKING
   ========================================= */

function ordenarRanking(ranking, criterio) {

    if (criterio === 'puntaje') {

        ordenarPorPuntaje(ranking);

    } else if (criterio === 'fecha') {

        ordenarPorFecha(ranking);

    } else if (criterio === 'duracion') {

        ordenarPorDuracion(ranking);

    } else if (criterio === 'nivel') {

        ordenarPorNivel(ranking);

    }

}


/* =========================================
   FORMATEAR DURACIÓN
   ========================================= */

function formatearDuracion(segundos) {

    var minutos =
        Math.floor(
            segundos / 60
        );

    var segundosRestantes =
        segundos % 60;


    var minutosTexto =
        minutos < 10
            ? '0' + minutos
            : minutos;


    var segundosTexto =
        segundosRestantes < 10
            ? '0' + segundosRestantes
            : segundosRestantes;


    return minutosTexto +
        ':' +
        segundosTexto;

}


/* =========================================
   NOMBRE DEL NIVEL
   ========================================= */

function obtenerNombreNivel(nivel) {

    if (nivel === 'facil') {
        return 'Fácil';
    }

    if (nivel === 'medio') {
        return 'Medio';
    }

    if (nivel === 'dificil') {
        return 'Difícil';
    }

    return nivel;

}


/* =========================================
   FORMATEAR FECHA
   ========================================= */

function formatearFecha(fecha) {

    var fechaObjeto =
        new Date(fecha);


    var dia =
        fechaObjeto.getDate();

    var mes =
        fechaObjeto.getMonth() + 1;

    var anio =
        fechaObjeto.getFullYear();

    var horas =
        fechaObjeto.getHours();

    var minutos =
        fechaObjeto.getMinutes();


    if (dia < 10) {
        dia = '0' + dia;
    }

    if (mes < 10) {
        mes = '0' + mes;
    }

    if (horas < 10) {
        horas = '0' + horas;
    }

    if (minutos < 10) {
        minutos = '0' + minutos;
    }


    return (
        dia +
        '/' +
        mes +
        '/' +
        anio +
        ' ' +
        horas +
        ':' +
        minutos
    );

}


/* =========================================
   MOSTRAR RANKING
   ========================================= */

function mostrarRanking(criterio) {

    var lista =
        document.getElementById(
            'lista-ranking'
        );


    lista.innerHTML = '';


    var ranking =
        obtenerRanking();


    document.getElementById('aviso-ranking').textContent = errorAlmacenamiento;

    ordenarRanking(
        ranking,
        criterio
    );


    if (ranking.length === 0) {

        var mensaje =
            document.createElement('p');

        mensaje.textContent =
            'Todavía no hay partidas registradas.';

        lista.appendChild(
            mensaje
        );

        return;

    }


    ranking.forEach(
        function (resultado, indice) {

            var elemento =
                document.createElement('div');

            elemento.classList.add(
                'item-ranking'
            );


            var posicion =
                document.createElement('strong');

            posicion.textContent =
                '#' + (indice + 1);


            var informacion =
                document.createElement('div');

            informacion.classList.add(
                'informacion-ranking'
            );


            var nombre =
                document.createElement('p');

            nombre.textContent =
                resultado.nombre;


            var datos =
                document.createElement('p');

            datos.textContent =
                obtenerNombreNivel(
                    resultado.nivel
                ) +
                ' · ' +
                resultado.puntaje +
                ' puntos';


            var detalle =
                document.createElement('small');

            detalle.textContent =
                'Intentos: ' +
                resultado.intentos +
                ' | Errores: ' +
                resultado.errores +
                ' | Tiempo: ' +
                formatearDuracion(
                    resultado.duracion
                ) +
                ' | ' +
                formatearFecha(
                    resultado.fecha
                );


            informacion.appendChild(
                nombre
            );

            informacion.appendChild(
                datos
            );

            informacion.appendChild(
                detalle
            );


            elemento.appendChild(
                posicion
            );

            elemento.appendChild(
                informacion
            );


            lista.appendChild(
                elemento
            );

        }
    );

}


/* =========================================
   BORRAR RANKING
   ========================================= */

function borrarRanking() {
    if (eliminarHistorial(CLAVE_RANKING)) {
        mostrarRanking(document.getElementById('orden-ranking').value);
    } else {
        document.getElementById('aviso-ranking').textContent = errorAlmacenamiento;
    }
}
