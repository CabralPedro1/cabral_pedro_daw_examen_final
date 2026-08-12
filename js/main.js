'use strict';


/* =========================================
   SELECCIÓN DE DIFICULTAD
   ========================================= */

opcionesDificultad.forEach(
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


        /* -----------------------------
           VALIDAR NOMBRE
           ----------------------------- */

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


        /* -----------------------------
           VALIDAR DIFICULTAD
           ----------------------------- */

        if (
            dificultadSeleccionada ===
            null
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


        /* -----------------------------
           INICIAR
           ----------------------------- */

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

document.getElementById(
    'boton-nueva-partida'
).addEventListener(
    'click',
    function () {

        iniciarNuevaPartida();

    }
);

/* =========================================
   VOLVER AL INICIO
   ========================================= */

document.getElementById(
    'boton-volver-inicio'
).addEventListener(
    'click',
    function () {

        volverAlInicio();

    }
);