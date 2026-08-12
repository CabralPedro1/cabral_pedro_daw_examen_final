'use strict';


/* =========================================
   CONFIGURACIÓN DE DIFICULTADES
   ========================================= */

var configuracionDificultades = {

    facil: {
        pares: 8,
        penalizacion: 10
    },

    medio: {
        pares: 10,
        penalizacion: 20
    },

    dificil: {
        pares: 18,
        penalizacion: 30
    }

};


/* =========================================
   DISCOGRAFÍA DEL JUEGO
   ========================================= */

var discos = [

    {
        id: 1,
        nombre: 'Gulp!',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/gulp.jpg'
    },

    {
        id: 2,
        nombre: 'Oktubre',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/oktubre.jpg'
    },

    {
        id: 3,
        nombre: 'Un Baión para el Ojo Idiota',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/un-baion.jpg'
    },

    {
        id: 4,
        nombre: '¡Bang! ¡Bang!... Estás Liquidado',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/bang-bang.jpg'
    },

    {
        id: 5,
        nombre: 'La Mosca y la Sopa',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/la-mosca-y-la-sopa.jpg'
    },

    {
        id: 6,
        nombre: 'Lobo Suelto',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/lobo-suelto.jpg'
    },

    {
        id: 7,
        nombre: 'Cordero Atado',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/cordero-atado.jpg'
    },

    {
        id: 8,
        nombre: 'Luzbelito',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/luzbelito.jpg'
    },

    {
        id: 9,
        nombre: 'Último Bondi a Finisterre',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/ultimo-bondi.jpg'
    },

    {
        id: 10,
        nombre: 'Momo Sampler',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/momo-sampler.jpg'
    },

    {
        id: 11,
        nombre: 'Anti-Identikit',
        artista: 'Los Redondos',
        imagen: 'assets/images/portadas/anti-identikit.jpg'
    },

    {
        id: 12,
        nombre: 'El Tesoro de los Inocentes',
        artista: 'Indio Solari',
        imagen: 'assets/images/portadas/el-tesoro-de-los-inocentes.jpg'
    },

    {
        id: 13,
        nombre: 'Porco Rex',
        artista: 'Indio Solari',
        imagen: 'assets/images/portadas/porco-rex.jpg'
    },

    {
        id: 14,
        nombre: 'El Perfume de la Tempestad',
        artista: 'Indio Solari',
        imagen: 'assets/images/portadas/el-perfume-de-la-tempestad.jpg'
    },

    {
        id: 15,
        nombre: 'Pajaritos, Bravos Muchachitos',
        artista: 'Indio Solari',
        imagen: 'assets/images/portadas/pajaritos-bravos-muchachitos.jpg'
    },

    {
        id: 16,
        nombre: 'El Ruiseñor, el Amor y la Muerte',
        artista: 'Indio Solari',
        imagen: 'assets/images/portadas/el-ruisenor.jpg'
    },

    {
        id: 17,
        nombre: 'En Concierto',
        artista: 'Indio Solari',
        imagen: 'assets/images/portadas/en-concierto.jpg'
    },

    {
        id: 18,
        nombre: 'Los Marsupiales Extintos',
        artista: 'El Míster',
        imagen: 'assets/images/portadas/marsupiales-extintos.jpg'
    }

];


/* =========================================
   ESTADO DE LA PARTIDA
   ========================================= */

var estadoJuego = {

    dificultad: null,

    nombre: '',

    puntaje: 0,

    intentos: 0,

    errores: 0,

    paresEncontrados: 0,

    primeraCarta: null,

    segundaCarta: null,

    tableroBloqueado: false,

    partidaIniciada: false,

    partidaFinalizada: false,

    segundos: 0,

    intervaloTiempo: null

};


/* =========================================
   OBTENER CONFIGURACIÓN
   ========================================= */

function obtenerConfiguracion(dificultad) {

    return configuracionDificultades[dificultad];

}


/* =========================================
   OBTENER DISCOS PARA LA PARTIDA
   ========================================= */

function obtenerDiscosParaPartida(dificultad) {

    var cantidadPares =
        obtenerConfiguracion(dificultad).pares;

    var discosMezclados =
        discos.slice();

    mezclarArray(discosMezclados);

    return discosMezclados.slice(0, cantidadPares);

}


/* =========================================
   CREAR PARES
   ========================================= */

function crearPares(discosSeleccionados) {

    var cartas = [];

    discosSeleccionados.forEach(function (disco) {

        var cartaUno = {
            id: disco.id,
            nombre: disco.nombre,
            artista: disco.artista,
            imagen: disco.imagen,
            instancia: 1
        };

        var cartaDos = {
            id: disco.id,
            nombre: disco.nombre,
            artista: disco.artista,
            imagen: disco.imagen,
            instancia: 2
        };

        cartas.push(cartaUno);
        cartas.push(cartaDos);

    });

    return cartas;

}


/* =========================================
   MEZCLAR ARRAY
   ========================================= */

function mezclarArray(array) {

    var i;
    var j;
    var temporal;

    for (
        i = array.length - 1;
        i > 0;
        i--
    ) {

        j = Math.floor(
            Math.random() * (i + 1)
        );

        temporal = array[i];

        array[i] = array[j];

        array[j] = temporal;

    }

}


/* =========================================
   MEZCLAR CARTAS
   ========================================= */

function mezclarCartas(cartas) {

    var cartasMezcladas = cartas.slice();

    mezclarArray(cartasMezcladas);

    return cartasMezcladas;

}


/* =========================================
   INICIAR ESTADO DE PARTIDA
   ========================================= */

function iniciarEstadoPartida(nombre, dificultad) {

    estadoJuego.dificultad = dificultad;

    estadoJuego.nombre = nombre;

    estadoJuego.puntaje = 0;

    estadoJuego.intentos = 0;

    estadoJuego.errores = 0;

    estadoJuego.paresEncontrados = 0;

    estadoJuego.primeraCarta = null;

    estadoJuego.segundaCarta = null;

    estadoJuego.tableroBloqueado = false;

    estadoJuego.partidaIniciada = false;

    estadoJuego.partidaFinalizada = false;

    estadoJuego.segundos = 0;

    detenerTemporizador();

    actualizarEstadisticas();

}


/* =========================================
   INICIAR TEMPORIZADOR
   ========================================= */

function iniciarTemporizador() {

    if (estadoJuego.partidaIniciada) {
        return;
    }

    estadoJuego.partidaIniciada = true;

    estadoJuego.intervaloTiempo =
        setInterval(function () {

            estadoJuego.segundos++;

            actualizarTiempo();

        }, 1000);

}


/* =========================================
   DETENER TEMPORIZADOR
   ========================================= */

function detenerTemporizador() {

    if (estadoJuego.intervaloTiempo !== null) {

        clearInterval(
            estadoJuego.intervaloTiempo
        );

        estadoJuego.intervaloTiempo = null;

    }

}


/* =========================================
   ACTUALIZAR TIEMPO
   ========================================= */

function actualizarTiempo() {

    var minutos =
        Math.floor(
            estadoJuego.segundos / 60
        );

    var segundos =
        estadoJuego.segundos % 60;

    var minutosTexto =
        minutos < 10
            ? '0' + minutos
            : minutos;

    var segundosTexto =
        segundos < 10
            ? '0' + segundos
            : segundos;

    document.getElementById('tiempo')
        .textContent =
        minutosTexto + ':' + segundosTexto;

}


/* =========================================
   ACTUALIZAR ESTADÍSTICAS
   ========================================= */

function actualizarEstadisticas() {

    document.getElementById('puntaje')
        .textContent =
        estadoJuego.puntaje;

    document.getElementById('intentos')
        .textContent =
        estadoJuego.intentos;

    document.getElementById('errores')
        .textContent =
        estadoJuego.errores;

    document.getElementById('pares-encontrados')
        .textContent =
        estadoJuego.paresEncontrados +
        ' / ' +
        obtenerConfiguracion(
            estadoJuego.dificultad
        ).pares;

    actualizarTiempo();

}


/* =========================================
   SUMAR PUNTOS
   ========================================= */

function sumarPuntos(cantidad) {

    estadoJuego.puntaje += cantidad;

}


/* =========================================
   APLICAR PENALIZACIÓN
   ========================================= */

function aplicarPenalizacion() {

    var penalizacion =
        obtenerConfiguracion(
            estadoJuego.dificultad
        ).penalizacion;

    estadoJuego.puntaje -= penalizacion;

    /*
     * El puntaje nunca puede ser negativo.
     */

    if (estadoJuego.puntaje < 0) {

        estadoJuego.puntaje = 0;

    }

}


/* =========================================
   REGISTRAR INTENTO
   ========================================= */

function registrarIntento() {

    estadoJuego.intentos++;

}


/* =========================================
   REGISTRAR ERROR
   ========================================= */

function registrarError() {

    estadoJuego.errores++;

    aplicarPenalizacion();

}


/* =========================================
   REGISTRAR PAR
   ========================================= */

function registrarParEncontrado() {

    estadoJuego.paresEncontrados++;

    sumarPuntos(100);

}


/* =========================================
   COMPROBAR VICTORIA
   ========================================= */

function comprobarVictoria() {

    var totalPares =
        obtenerConfiguracion(
            estadoJuego.dificultad
        ).pares;

    if (
        estadoJuego.paresEncontrados ===
        totalPares
    ) {

        finalizarPartida();

    }

}


/* =========================================
   FINALIZAR PARTIDA
   ========================================= */

function finalizarPartida() {

    estadoJuego.partidaFinalizada = true;

    detenerTemporizador();

    /*
     * Bonus por completar la partida.
     */

    sumarPuntos(300);

    actualizarEstadisticas();

    mostrarResultadoFinal();

}

/* =========================================
   MOSTRAR RESULTADO FINAL
   ========================================= */

function mostrarResultadoFinal() {

    document.getElementById(
        'resultado-nombre'
    ).textContent =
        estadoJuego.nombre;


    document.getElementById(
        'resultado-nivel'
    ).textContent =
        estadoJuego.dificultad;


    document.getElementById(
        'resultado-tiempo'
    ).textContent =
        formatearTiempo(
            estadoJuego.segundos
        );


    document.getElementById(
        'resultado-intentos'
    ).textContent =
        estadoJuego.intentos;


    document.getElementById(
        'resultado-errores'
    ).textContent =
        estadoJuego.errores;


    document.getElementById(
        'resultado-puntaje'
    ).textContent =
        estadoJuego.puntaje;


    document.getElementById(
        'modal-victoria'
    ).classList.remove(
        'oculto'
    );

}


/* =========================================
   FORMATEAR TIEMPO
   ========================================= */

function formatearTiempo(segundos) {

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