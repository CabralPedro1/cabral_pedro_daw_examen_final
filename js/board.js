'use strict';


/* =========================================
   ELEMENTOS DEL TABLERO
   ========================================= */

var tablero =
    document.getElementById('tablero');


/* =========================================
   LIMPIAR TABLERO
   ========================================= */

function limpiarTablero() {

    tablero.innerHTML = '';

}


/* =========================================
   CREAR CARTA
   ========================================= */

function crearCarta(carta) {

    var elementoCarta =
        document.createElement('article');

    elementoCarta.classList.add('carta');

    elementoCarta.dataset.id =
        carta.id;


    /* =====================================
       CONTENIDO
       ===================================== */

    var contenido =
        document.createElement('div');

    contenido.classList.add(
        'carta-contenido'
    );


    /* =====================================
       DORSO
       ===================================== */

    var dorso =
        document.createElement('div');

    dorso.classList.add(
        'carta-dorso'
    );


    var imagenDorso =
        document.createElement('img');

    imagenDorso.src =
        'assets/images/logo/logo-redondos.png';

    imagenDorso.alt =
        'Logo de Los Redondos';


    /* =====================================
       FRENTE
       ===================================== */

    var frente =
        document.createElement('div');

    frente.classList.add(
        'carta-frente'
    );


    var imagenFrente =
        document.createElement('img');

    imagenFrente.src =
        carta.imagen;

    imagenFrente.alt =
        'Portada de ' + carta.nombre;


    /* =====================================
       ARMAR CARTA
       ===================================== */

    dorso.appendChild(
        imagenDorso
    );

    frente.appendChild(
        imagenFrente
    );

    contenido.appendChild(
        dorso
    );

    contenido.appendChild(
        frente
    );

    elementoCarta.appendChild(
        contenido
    );


    /* =====================================
       EVENTO CLICK
       ===================================== */

    elementoCarta.addEventListener(
        'click',
        function () {

            seleccionarCarta(
                elementoCarta
            );

        }
    );


    return elementoCarta;

}


/* =========================================
   CREAR TABLERO
   ========================================= */

function crearTablero(cartas) {

    limpiarTablero();

    tablero.classList.remove('bloqueado');

    var cantidadCartas = cartas.length;

    var columnas = 4;

    if (cantidadCartas === 20) {
        columnas = 5;
    }

    if (cantidadCartas === 36) {
        columnas = 6;
    }

    tablero.style.gridTemplateColumns =
        'repeat(' + columnas + ', 1fr)';


    cartas.forEach(function (carta) {

        var elementoCarta =
            crearCarta(carta);

        tablero.appendChild(
            elementoCarta
        );

    });

}


/* =========================================
   SELECCIONAR CARTA
   ========================================= */

function seleccionarCarta(elementoCarta) {

    if (
        estadoJuego.tableroBloqueado ||
        estadoJuego.partidaFinalizada
    ) {

        return;

    }


    if (
        elementoCarta.classList.contains(
            'girada'
        )
    ) {

        return;

    }


    if (
        elementoCarta.classList.contains(
            'encontrada'
        )
    ) {

        return;

    }


    /*
     * El temporizador comienza
     * al revelar la primera carta.
     */

    if (!estadoJuego.partidaIniciada) {

        iniciarTemporizador();

    }


    elementoCarta.classList.add(
        'girada'
    );


    if (
        estadoJuego.primeraCarta === null
    ) {

        estadoJuego.primeraCarta =
            elementoCarta;

        return;

    }


    estadoJuego.segundaCarta =
        elementoCarta;

    registrarIntento();

    actualizarEstadisticas();

    comprobarPareja();

}


/* =========================================
   COMPROBAR PAREJA
   ========================================= */

function comprobarPareja() {

    var primera =
        estadoJuego.primeraCarta;

    var segunda =
        estadoJuego.segundaCarta;


    var mismoId =
        primera.dataset.id ===
        segunda.dataset.id;


    if (mismoId) {

        parejaCorrecta(
            primera,
            segunda
        );

    } else {

        parejaIncorrecta(
            primera,
            segunda
        );

    }

}


/* =========================================
   PAREJA CORRECTA
   ========================================= */

function parejaCorrecta(
    primera,
    segunda
) {

    primera.classList.add(
        'encontrada'
    );

    segunda.classList.add(
        'encontrada'
    );

    registrarParEncontrado();

    limpiarSeleccion();

    actualizarEstadisticas();

    comprobarVictoria();

}


/* =========================================
   PAREJA INCORRECTA
   ========================================= */

function parejaIncorrecta(
    primera,
    segunda
) {

    estadoJuego.tableroBloqueado =
        true;

    tablero.classList.add(
        'bloqueado'
    );

    registrarError();

    actualizarEstadisticas();


    /*
     * Las cartas permanecen visibles
     * durante un breve intervalo.
     */

    setTimeout(function () {

        primera.classList.remove(
            'girada'
        );

        segunda.classList.remove(
            'girada'
        );

        limpiarSeleccion();

        estadoJuego.tableroBloqueado =
            false;

        tablero.classList.remove(
            'bloqueado'
        );

    }, 700);

}


/* =========================================
   LIMPIAR SELECCIÓN
   ========================================= */

function limpiarSeleccion() {

    estadoJuego.primeraCarta =
        null;

    estadoJuego.segundaCarta =
        null;

}