'use strict';

var botonNuevaPartida =
    document.getElementById(
        'boton-nueva-partida'
    );

var botonVolverInicio =
    document.getElementById(
        'boton-volver-inicio'
    );

var botonRankingJuego =
    document.getElementById(
        'boton-ranking-juego'
    );

var botonRanking =
    document.getElementById(
        'boton-ranking'
    );

var botonCerrarRanking =
    document.getElementById(
        'boton-cerrar-ranking'
    );

var ordenRanking =
    document.getElementById(
        'orden-ranking'
    );

var botonBorrarRanking =
    document.getElementById(
        'boton-borrar-ranking'
    );

var botonCancelarBorrado =
    document.getElementById(
        'boton-cancelar-borrado'
    );

var botonConfirmarBorrado =
    document.getElementById(
        'boton-confirmar-borrado'
    );

var botonReiniciar =
    document.getElementById(
        'boton-reiniciar'
    );

var botonContinuar =
    document.getElementById(
        'boton-continuar'
    );

var botonAbandonar =
    document.getElementById(
        'boton-abandonar'
    );

document.getElementById('boton-confirmar-reinicio').addEventListener('click', function () {
    document.getElementById('modal-reinicio').classList.add('oculto');
    iniciarNuevaPartida();
});


/* =========================================
   SELECCIÓN DE DIFICULTAD
   ========================================= */

Array.prototype.forEach.call(opcionesDificultad,
    function (opcion) {

        opcion.addEventListener(
            'click',
            function () {

                seleccionarDificultad(
                    opcion
                );

            }
        );

    }
);


/* =========================================
   INICIAR PARTIDA
   ========================================= */

formularioInicio.addEventListener(
    'submit',
    function (evento) {


        var nombre =
            nombreJugador.value.trim();

        var formularioValido =
            true;

        evento.preventDefault();


        /* ---------------------------------
           VALIDAR NOMBRE
           --------------------------------- */

        if (!validarNombre(nombre)) {

            mostrarError(
                errorNombre,
                'El nombre debe tener al menos 3 caracteres.'
            );

            formularioValido =
                false;

        } else {

            limpiarError(
                errorNombre
            );

        }


        /* ---------------------------------
           VALIDAR DIFICULTAD
           --------------------------------- */

        if (
            dificultadSeleccionada === null
        ) {

            mostrarError(
                errorDificultad,
                'Seleccioná una dificultad.'
            );

            formularioValido =
                false;

        } else {

            limpiarError(
                errorDificultad
            );

        }


        /* ---------------------------------
           CREAR PARTIDA
           --------------------------------- */

        if (formularioValido) {
            prepararPartida(nombre, dificultadSeleccionada);
        }

    }
);


/* =========================================
   NUEVA PARTIDA
   ========================================= */


if (botonNuevaPartida !== null) {

    botonNuevaPartida.addEventListener(
        'click',
        function () {

            iniciarNuevaPartida();

        }
    );

}


/* =========================================
   VOLVER AL INICIO
   ========================================= */


if (botonVolverInicio !== null) {

    botonVolverInicio.addEventListener(
        'click',
        function () {

            volverAlInicio();

        }
    );

}


/* =========================================
   RANKING DESDE EL JUEGO
   ========================================= */


if (botonRankingJuego !== null) {

    botonRankingJuego.addEventListener(
        'click',
        function () {

            document.getElementById(
                'modal-ranking'
            ).classList.remove(
                'oculto'
            );


            ordenRanking.value = 'puntaje';
            mostrarRanking('puntaje');

        }
    );

}


/* =========================================
   RANKING DESDE EL RESULTADO FINAL
   ========================================= */


if (botonRanking !== null) {

    botonRanking.addEventListener(
        'click',
        function () {

            document.getElementById(
                'modal-victoria'
            ).classList.add(
                'oculto'
            );


            document.getElementById(
                'modal-ranking'
            ).classList.remove(
                'oculto'
            );


            ordenRanking.value = 'puntaje';
            mostrarRanking('puntaje');

        }
    );

}


/* =========================================
   CERRAR RANKING
   ========================================= */


if (botonCerrarRanking !== null) {

    botonCerrarRanking.addEventListener(
        'click',
        function () {

            document.getElementById(
                'modal-ranking'
            ).classList.add(
                'oculto'
            );


            /*
             * Si la partida ya terminó,
             * volvemos al resultado.
             */

            if (
                estadoJuego.partidaFinalizada
            ) {

                document.getElementById(
                    'modal-victoria'
                ).classList.remove(
                    'oculto'
                );

            }

        }
    );

}


/* =========================================
   CAMBIAR ORDEN DEL RANKING
   ========================================= */


if (ordenRanking !== null) {

    ordenRanking.addEventListener(
        'change',
        function () {

            mostrarRanking(
                this.value
            );

        }
    );

}


/* =========================================
   ABRIR CONFIRMACIÓN DE BORRADO
   ========================================= */


if (botonBorrarRanking !== null) {

    botonBorrarRanking.addEventListener(
        'click',
        function () {

            document.getElementById(
                'modal-confirmar-borrado'
            ).classList.remove(
                'oculto'
            );

        }
    );

}


/* =========================================
   CANCELAR BORRADO
   ========================================= */


if (botonCancelarBorrado !== null) {

    botonCancelarBorrado.addEventListener(
        'click',
        function () {

            document.getElementById(
                'modal-confirmar-borrado'
            ).classList.add(
                'oculto'
            );

        }
    );

}


/* =========================================
   CONFIRMAR BORRADO
   ========================================= */


if (botonConfirmarBorrado !== null) {

    botonConfirmarBorrado.addEventListener(
        'click',
        function () {

            borrarRanking();


            document.getElementById(
                'modal-confirmar-borrado'
            ).classList.add(
                'oculto'
            );

        }
    );

}


/* =========================================
   BOTÓN REINICIAR
   ========================================= */


if (botonReiniciar !== null) {

    botonReiniciar.addEventListener(
        'click',
        function () {

            document.getElementById(
                'modal-reinicio'
            ).classList.remove(
                'oculto'
            );

        }
    );

}


/* =========================================
   CONTINUAR JUGANDO
   ========================================= */


if (botonContinuar !== null) {

    botonContinuar.addEventListener(
        'click',
        function () {

            document.getElementById(
                'modal-reinicio'
            ).classList.add(
                'oculto'
            );

        }
    );

}


/* =========================================
   ABANDONAR Y COMENZAR NUEVA
   ========================================= */


if (botonAbandonar !== null) {

    botonAbandonar.addEventListener(
        'click',
        function () {

            document.getElementById(
                'modal-reinicio'
            ).classList.add(
                'oculto'
            );


            volverAlInicio();

        }
    );

}
