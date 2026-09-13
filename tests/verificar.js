'use strict';

/* Pruebas locales sin dependencias: node tests/verificar.js */
var assert = require('node:assert/strict');
var fs = require('node:fs');
var path = require('node:path');
var vm = require('node:vm');
var raiz = path.join(__dirname, '..');
var verificaciones = 0;

function comprobar(valor, mensaje) {
    assert.ok(valor, mensaje);
    verificaciones++;
}

function entorno(archivo) {
    var html = fs.readFileSync(path.join(raiz, archivo), 'utf8');
    var elementos = {};
    var dificultades = [];
    var tareas = {};
    var siguiente = 0;
    var ahora = 0;
    var datos = {};
    var modales = [];
    function elemento(etiqueta) {
        var clases = [];
        var atributos = {};
        var hijos = [];
        var el = {
            tagName: etiqueta, style: {}, dataset: {}, value: '', textContent: '',
            children: hijos, clientWidth: 900, offsetHeight: 44, listeners: {},
            classList: {
                add: function (c) { if (clases.indexOf(c) < 0) { clases.push(c); } },
                remove: function (c) { var i = clases.indexOf(c); if (i >= 0) { clases.splice(i, 1); } },
                contains: function (c) { return clases.indexOf(c) >= 0; }
            },
            setAttribute: function (k, v) { atributos[k] = String(v); },
            getAttribute: function (k) { return atributos[k]; },
            appendChild: function (child) { hijos.push(child); child.parentNode = el; },
            addEventListener: function (tipo, fn) {
                if (!el.listeners[tipo]) { el.listeners[tipo] = []; }
                el.listeners[tipo].push(fn);
            },
            focus: function () {},
            getBoundingClientRect: function () { return {top: 220}; },
            emitir: function (tipo) {
                (el.listeners[tipo] || []).forEach(function (fn) { fn.call(el, {preventDefault: function () {}}); });
            }
        };
        Object.defineProperty(el, 'innerHTML', {set: function () { hijos.length = 0; }});
        return el;
    }
    var etiquetas = html.match(/<[a-z][^>]*>/gi) || [];
    etiquetas.forEach(function (tag) {
        comprobar(!/\son\w+\s*=/i.test(tag), 'Sin JavaScript inline');
        var id = /\bid="([^"]+)"/.exec(tag);
        var dificultad = /data-dificultad="([^"]+)"/.exec(tag);
        if (!id && !dificultad) { return; }
        var el = elemento(tag.match(/^<([a-z]+)/i)[1]);
        if (id) {
            comprobar(!elementos[id[1]], 'ID único: ' + id[1]);
            elementos[id[1]] = el;
            el.id = id[1];
        }
        var clase = /class="([^"]+)"/.exec(tag);
        if (clase) { clase[1].split(' ').forEach(function (c) { el.classList.add(c); }); }
        if (el.classList.contains('modal')) { modales.push(el); }
        if (dificultad) { el.dataset.dificultad = dificultad[1]; dificultades.push(el); }
    });
    var doc = {
        getElementById: function (id) { assert.ok(elementos[id], 'Referencia existente: ' + id); return elementos[id]; },
        createElement: elemento,
        querySelectorAll: function () { return dificultades; },
        querySelector: function (selector) {
            if (selector === 'body > .pie-pagina') { return {offsetHeight: 44}; }
            return modales.filter(function (m) { return !m.classList.contains('oculto'); })[0] || null;
        }
    };
    if (elementos.tablero) { elementos.tablero.parentNode = {clientWidth: 900}; }
    function programar(fn, ms, repetir) { siguiente++; tareas[siguiente] = {fn: fn, ms: ms, vence: ahora + ms, repetir: repetir}; return siguiente; }
    var contexto = {
        document: doc,
        window: {innerWidth: 1366, innerHeight: 768, addEventListener: function () {}, getComputedStyle: function () { return {gap: '10', paddingLeft: '12'}; }},
        localStorage: {
            getItem: function (k) { return datos[k] || null; },
            setItem: function (k, v) { datos[k] = v; },
            removeItem: function (k) { delete datos[k]; }
        },
        setTimeout: function (fn, ms) { return programar(fn, ms, false); },
        setInterval: function (fn, ms) { return programar(fn, ms, true); },
        clearTimeout: function (id) { delete tareas[id]; },
        clearInterval: function (id) { delete tareas[id]; }
    };
    vm.createContext(contexto);
    contexto.relojPrueba = function () { return ahora; };
    vm.runInContext('Date.now = relojPrueba;', contexto);
    var scripts = html.match(/<script src="[^"]+"><\/script>/g) || [];
    scripts.forEach(function (tag) {
        var src = tag.match(/src="([^"]+)"/)[1];
        var codigo = fs.readFileSync(path.resolve(raiz, path.dirname(archivo), src), 'utf8');
        comprobar(/^'use strict';/.test(codigo), 'Strict: ' + src);
        comprobar(!/\b(?:const|let)\b|=>|`|\b(?:alert|confirm|prompt)\s*\(/.test(codigo), 'Sintaxis requerida: ' + src);
        vm.runInContext(codigo, contexto, {filename: src});
    });
    contexto.avanzar = function (ms) {
        var hasta = ahora + ms;
        while (true) {
            var id = Object.keys(tareas).sort(function (a, b) { return tareas[a].vence - tareas[b].vence; })[0];
            if (!id || tareas[id].vence > hasta) { break; }
            var tarea = tareas[id];
            ahora = tarea.vence;
            if (tarea.repetir) { tarea.vence += tarea.ms; } else { delete tareas[id]; }
            tarea.fn();
        }
        ahora = hasta;
    };
    contexto.avanzarSinCallbacks = function (ms) {
        ahora += ms;
    };
    contexto.el = elementos;
    contexto.dificultadesPrueba = dificultades;
    contexto.click = function (id) { elementos[id].emitir('click'); };
    contexto.iniciar = function (nivel) {
        elementos['nombre-jugador'].value = 'Pedro';
        dificultades.filter(function (d) { return d.dataset.dificultad === nivel; })[0].emitir('click');
        elementos['formulario-inicio'].emitir('submit');
    };
    return contexto;
}

['facil', 'medio', 'dificil'].forEach(function (nivel, indice) {
    var c = entorno('index.html');
    c.el['formulario-inicio'].emitir('submit');
    comprobar(c.el['error-nombre'].textContent && c.el['error-dificultad'].textContent, 'Validar configuración');
    c.iniciar(nivel);
    var cartas = c.el.tablero.children;
    var total = [16, 20, 36][indice];
    comprobar(cartas.length === total, 'Cantidad ' + nivel);
    comprobar(Number(c.el.tablero.getAttribute('data-columnas')) === [4, 5, 6][indice], 'Columnas ' + nivel);
    comprobar(cartas.every(function (e) { return e.classList.contains('girada'); }), 'Vista inicial');
    cartas[0].emitir('click');
    comprobar(c.estadoJuego.primeraCarta === null, 'Bloqueo inicial');
    c.avanzar(2500);
    comprobar(c.estadoJuego.segundos === 0 && !c.estadoJuego.partidaIniciada, 'Reloj espera primera selección');
    cartas[0].emitir('click');
    cartas[0].emitir('click');
    comprobar(c.estadoJuego.intentos === 0, 'No seleccionar la misma carta dos veces');
    var distinta = cartas.filter(function (e) { return e.dataset.id !== cartas[0].dataset.id; })[0];
    distinta.emitir('click');
    cartas[2].emitir('click');
    comprobar(c.estadoJuego.intentos === 1 && c.estadoJuego.errores === 1 && c.estadoJuego.puntaje === 0, 'Error y límite de dos cartas');
    c.avanzar(999);
    comprobar(c.estadoJuego.tableroBloqueado, 'Esperar un segundo');
    c.avanzar(1);
    comprobar(!c.estadoJuego.tableroBloqueado && c.estadoJuego.segundos === 1, 'Ocultar y cronometrar');
    c.click('boton-ranking-juego');
    cartas[0].emitir('click');
    comprobar(c.estadoJuego.primeraCarta === null, 'Ranking bloquea selección');
    c.click('boton-cerrar-ranking');
    cartas[0].emitir('click'); distinta.emitir('click');
    c.click('boton-reiniciar'); c.click('boton-continuar');
    comprobar(c.estadoJuego.intentos === 2, 'Continuar conserva estadísticas');
    c.click('boton-reiniciar'); c.click('boton-confirmar-reinicio');
    c.avanzar(1000);
    comprobar(c.estadoJuego.tableroBloqueado && c.estadoJuego.intentos === 0 && c.estadoJuego.segundos === 0, 'Reinicio cancela callbacks antiguos');
    comprobar(c.obtenerRanking().length === 0, 'Reinicio incompleto no se guarda');
    c.avanzar(1500);
    c.estadoJuego.puntaje = 100;
    c.aplicarPenalizacion();
    comprobar(c.estadoJuego.puntaje === 100 - [10, 20, 30][indice], 'Penalización ' + nivel);
    c.estadoJuego.puntaje = 0;
    var grupos = {};
    c.el.tablero.children.forEach(function (e) { (grupos[e.dataset.id] || (grupos[e.dataset.id] = [])).push(e); });
    Object.keys(grupos).forEach(function (id) {
        grupos[id][0].emitir('click'); grupos[id][1].emitir('click');
    });
    comprobar(c.estadoJuego.partidaFinalizada && c.estadoJuego.puntaje === total / 2 * 100 + 300, 'Victoria y bonus ' + nivel);
    comprobar(c.obtenerRanking().length === 1 && c.estadoJuego.intervaloTiempo === null, 'Guardar una partida y detener reloj');
    c.finalizarPartida(); c.guardarResultado();
    comprobar(c.obtenerRanking().length === 1, 'Sin resultados ni bonus duplicados');
    c.click('boton-ranking'); c.click('boton-cerrar-ranking');
    comprobar(!c.el['modal-victoria'].classList.contains('oculto'), 'Ranking vuelve al resultado');
    c.click('boton-nueva-partida');
    comprobar(c.estadoJuego.nombre === 'Pedro' && c.estadoJuego.dificultad === nivel && c.estadoJuego.intentos === 0, 'Revancha inmediata');
    c.click('boton-reiniciar'); c.click('boton-abandonar'); c.avanzar(4000);
    comprobar(!c.el['pantalla-inicial'].classList.contains('oculto') && c.el.tablero.children.length === 0, 'Abandonar vuelve al inicio');
    comprobar(c.obtenerRanking().length === 1, 'Abandono no guardado');
    c.iniciar(nivel); c.avanzar(2500);
    c.click('boton-ranking-juego');
    c.click('boton-borrar-ranking'); c.click('boton-cancelar-borrado');
    comprobar(c.obtenerRanking().length === 1, 'Cancelar borrado conserva datos');
    c.click('boton-borrar-ranking'); c.click('boton-confirmar-borrado');
    comprobar(c.obtenerRanking().length === 0, 'Borrar tras confirmación');
    c.localStorage.setItem(c.CLAVE_RANKING, '{mal');
    comprobar(c.obtenerRanking().length === 0 && c.errorAlmacenamiento, 'JSON corrupto');
    c.localStorage.setItem(c.CLAVE_RANKING, 'null');
    comprobar(c.obtenerRanking().length === 0, 'Formato inválido');
    c.localStorage.setItem(c.CLAVE_RANKING, '[null,{},5]');
    comprobar(c.obtenerRanking().length === 0, 'Filtrar registros inválidos');
    c.localStorage.getItem = function () { throw new Error('SecurityError'); };
    comprobar(c.obtenerRanking().length === 0 && c.errorAlmacenamiento, 'Storage bloqueado');
    c.localStorage.setItem = function () { throw new Error('QuotaExceededError'); };
    comprobar(c.guardarRanking([]) === false && c.errorAlmacenamiento, 'Cuota agotada');
    c.localStorage.removeItem = function () { throw new Error('SecurityError'); };
    c.borrarRanking();
    comprobar(c.el['aviso-ranking'].textContent, 'Avisar fallo de borrado');
});

/* El reloj avanza, pero el callback del intervalo todavía no pudo ejecutarse. */
var demorado = entorno('index.html');
demorado.iniciar('facil');
demorado.avanzar(2500);
var paresDemorados = {};
demorado.el.tablero.children.forEach(function (carta) {
    (paresDemorados[carta.dataset.id] || (paresDemorados[carta.dataset.id] = [])).push(carta);
});
var idsDemorados = Object.keys(paresDemorados);
paresDemorados[idsDemorados[0]][0].emitir('click');
demorado.avanzarSinCallbacks(10900);
comprobar(demorado.estadoJuego.segundos === 0, 'El intervalo demorado no actualizó el tiempo');
idsDemorados.forEach(function (id) {
    paresDemorados[id][0].emitir('click');
    paresDemorados[id][1].emitir('click');
});
comprobar(demorado.estadoJuego.partidaFinalizada, 'Completar tablero con intervalo demorado');
comprobar(demorado.estadoJuego.segundos === 10, 'Calcular segundos completos al finalizar');
comprobar(demorado.obtenerRanking()[0].duracion === 10, 'Guardar duración real con intervalo demorado');
comprobar(demorado.el.tiempo.textContent === '00:10', 'Actualizar tiempo visible al finalizar');
comprobar(demorado.el['resultado-tiempo'].textContent === '00:10', 'Mostrar duración correcta en resultado');
comprobar(demorado.estadoJuego.intervaloTiempo === null, 'Cancelar intervalo demorado al finalizar');
demorado.avanzar(5000);
comprobar(demorado.estadoJuego.segundos === 10, 'Mantener duración final sin callbacks posteriores');

var ranking = entorno('index.html');
var resultados = [
    {nombre: 'Ana', nivel: 'facil', puntaje: 900, duracion: 80, intentos: 10, errores: 2, fecha: '2026-08-01T10:00:00Z'},
    {nombre: 'Beto', nivel: 'dificil', puntaje: 800, duracion: 60, intentos: 20, errores: 2, fecha: '2026-09-01T10:00:00Z'},
    {nombre: 'Caro', nivel: 'medio', puntaje: 1000, duracion: 100, intentos: 12, errores: 2, fecha: '2026-07-01T10:00:00Z'}
];
ranking.guardarRanking(resultados);
['puntaje', 'fecha', 'duracion', 'nivel'].forEach(function (criterio, indice) {
    var ordenados = ranking.obtenerRanking();
    ranking.ordenarRanking(ordenados, criterio);
    comprobar(ordenados[0].nombre === ['Caro', 'Beto', 'Beto', 'Beto'][indice], 'Ordenar por ' + criterio);
});
ranking.iniciar('facil'); ranking.avanzar(2500);
ranking.el['orden-ranking'].value = 'nivel';
ranking.click('boton-ranking-juego');
comprobar(ranking.el['orden-ranking'].value === 'puntaje', 'Restablecer selector al abrir ranking');
ranking.click('boton-cerrar-ranking');
ranking.localStorage.setItem = function () { throw new Error('QuotaExceededError'); };
var paresVictoria = {};
ranking.el.tablero.children.forEach(function (e) { (paresVictoria[e.dataset.id] || (paresVictoria[e.dataset.id] = [])).push(e); });
Object.keys(paresVictoria).forEach(function (id) { paresVictoria[id][0].emitir('click'); paresVictoria[id][1].emitir('click'); });
comprobar(!ranking.el['modal-victoria'].classList.contains('oculto') && ranking.el['aviso-almacenamiento'].textContent, 'La victoria sigue disponible si falla el guardado');
ranking.click('boton-volver-inicio');
comprobar(!ranking.el['pantalla-inicial'].classList.contains('oculto'), 'Volver al inicio desde resultado');
Object.keys(ranking.el).forEach(function (id) {
    Object.keys(ranking.el[id].listeners).forEach(function (tipo) {
        comprobar(ranking.el[id].listeners[tipo].length === 1, 'Listener único: ' + id + ' ' + tipo);
    });
});

var contacto = entorno('pages/contact.html');
contacto.el['formulario-contacto'].emitir('submit');
comprobar(contacto.el['error-nombre-contacto'].textContent && contacto.el['error-email-contacto'].textContent && contacto.el['error-mensaje-contacto'].textContent, 'Contacto vacío');
contacto.el['nombre-contacto'].value = 'Pedro';
contacto.el['email-contacto'].value = 'no-es-email';
contacto.el['mensaje-contacto'].value = 'Consulta';
contacto.el['formulario-contacto'].emitir('submit');
comprobar(contacto.el['error-email-contacto'].textContent, 'Email inválido');
contacto.el['email-contacto'].value = 'pedro@example.com';
contacto.el['formulario-contacto'].emitir('submit');
comprobar(contacto.el['resultado-contacto'].textContent && !contacto.el['error-email-contacto'].textContent, 'Contacto válido');
console.log('OK: ' + verificaciones + ' verificaciones. DOM y reloj simulados; no reemplaza la revisión visual en navegador.');
