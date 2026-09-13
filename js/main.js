'use strict';

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

        evento.preventDefault();


        var nombre =
            nombreJugador.value.trim();

        var formularioValido =
            true;


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

            iniciarEstadoPartida(
                nombre,
                dificultadSeleccionada
            );


            mostrarPantallaJuego(
                nombre,
                dificultadSeleccionada
            );


            var discosSeleccionados =
                obtenerDiscosParaPartida(
                    dificultadSeleccionada
                );


            var pares =
                crearPares(
                    discosSeleccionados
                );


            var cartas =
                mezclarCartas(
                    pares
                );


            crearTablero(
                cartas
            );

        }

    }
);



/* =========================================
   NUEVA PARTIDA
   ========================================= */

var botonNuevaPartida =
    document.getElementById(
        'boton-nueva-partida'
    );


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

var botonVolverInicio =
    document.getElementById(
        'boton-volver-inicio'
    );


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

var botonRankingJuego =
    document.getElementById(
        'boton-ranking-juego'
    );


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

var botonRanking =
    document.getElementById(
        'boton-ranking'
    );


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

var botonCerrarRanking =
    document.getElementById(
        'boton-cerrar-ranking'
    );


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

var ordenRanking =
    document.getElementById(
        'orden-ranking'
    );


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

var botonBorrarRanking =
    document.getElementById(
        'boton-borrar-ranking'
    );


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

var botonCancelarBorrado =
    document.getElementById(
        'boton-cancelar-borrado'
    );


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

var botonConfirmarBorrado =
    document.getElementById(
        'boton-confirmar-borrado'
    );


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

var botonReiniciar =
    document.getElementById(
        'boton-reiniciar'
    );


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

var botonContinuar =
    document.getElementById(
        'boton-continuar'
    );


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

var botonAbandonar =
    document.getElementById(
        'boton-abandonar'
    );


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
