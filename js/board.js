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

    cancelarEsperasTablero();
    tablero.innerHTML = '';

}


/* =========================================
   CREAR CARTA
   ========================================= */

function crearCarta(carta) {

    var elementoCarta =
        document.createElement('button');

    elementoCarta.type = 'button';
    elementoCarta.setAttribute('aria-label', 'Carta boca abajo');
    elementoCarta.setAttribute('data-nombre', carta.nombre);

    elementoCarta.classList.add('carta');

    elementoCarta.dataset.id =
        carta.id;


    /* =====================================
       CONTENIDO
       ===================================== */

    var contenido =
        document.createElement('span');

    contenido.classList.add(
        'carta-contenido'
    );


    /* =====================================
       DORSO
       ===================================== */

    var dorso =
        document.createElement('span');

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
        document.createElement('span');

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

    tablero.setAttribute('data-columnas', columnas);


    cartas.forEach(function (carta) {

        var elementoCarta =
            crearCarta(carta);

        tablero.appendChild(
            elementoCarta
        );

    });

    ajustarTablero();
    estadoJuego.tableroBloqueado = true;
    tablero.classList.add('bloqueado');
    Array.prototype.forEach.call(tablero.children, function (carta) {
        carta.classList.add('girada');
    });
    estadoJuego.esperaInicial = setTimeout(function () {
        Array.prototype.forEach.call(tablero.children, function (carta) {
            carta.classList.remove('girada');
        });
        estadoJuego.esperaInicial = null;
        estadoJuego.tableroBloqueado = false;
        tablero.classList.remove('bloqueado');
    }, 2500);
}


/* =========================================
   SELECCIONAR CARTA
   ========================================= */

function seleccionarCarta(elementoCarta) {

    if (
        estadoJuego.tableroBloqueado ||
        estadoJuego.partidaFinalizada ||
        document.querySelector('.modal:not(.oculto)') !== null
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
    elementoCarta.setAttribute('aria-label', elementoCarta.getAttribute('data-nombre'));


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

    estadoJuego.esperaPareja = setTimeout(function () {

        estadoJuego.esperaPareja = null;
        primera.setAttribute('aria-label', 'Carta boca abajo');
        segunda.setAttribute('aria-label', 'Carta boca abajo');

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

    }, 1000);

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

function cancelarEsperasTablero() {
    clearTimeout(estadoJuego.esperaInicial);
    clearTimeout(estadoJuego.esperaPareja);
    estadoJuego.esperaInicial = null;
    estadoJuego.esperaPareja = null;
}

/* Ajustar ambos ejes: el ancho por sí solo no garantiza que entren las filas. */
function ajustarTablero() {
    if (!tablero.children.length || pantallaJuego.classList.contains('oculto')) {
        return;
    }
    var columnas = Number(tablero.getAttribute('data-columnas'));
    var filas = tablero.children.length / columnas;
    var estilo = window.getComputedStyle(tablero);
    var espacio = parseFloat(estilo.gap) || 0;
    var borde = parseFloat(estilo.paddingLeft) * 2 + 2;
    var anchoDisponible = tablero.parentNode.clientWidth;
    var lado = (Math.min(anchoDisponible, 820) - borde - espacio * (columnas - 1)) / columnas;
    if (window.innerWidth > 768) {
        var footer = document.querySelector('body > .pie-pagina');
        var altoDisponible = window.innerHeight - tablero.getBoundingClientRect().top - footer.offsetHeight - 24;
        lado = Math.min(lado, (altoDisponible - borde - espacio * (filas - 1)) / filas);
    }
    lado = Math.max(32, Math.floor(lado));
    tablero.style.width = (lado * columnas + espacio * (columnas - 1) + borde) + 'px';
    Array.prototype.forEach.call(tablero.children, function (carta) {
        carta.style.width = lado + 'px';
        carta.style.height = lado + 'px';
    });
}

window.addEventListener('resize', ajustarTablero);
window.addEventListener('load', ajustarTablero);
