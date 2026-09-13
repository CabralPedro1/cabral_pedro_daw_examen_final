'use strict';

var formularioContacto = document.getElementById('formulario-contacto');

formularioContacto.addEventListener('submit', function (evento) {
    evento.preventDefault();
    var nombre = document.getElementById('nombre-contacto');
    var email = document.getElementById('email-contacto');
    var mensaje = document.getElementById('mensaje-contacto');
    var resultado = document.getElementById('resultado-contacto');
    var campos = [nombre, email, mensaje];
    var errores = [
        validarNombre(nombre.value) ? '' : 'Ingresá un nombre de al menos 3 caracteres.',
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Ingresá un email válido.',
        mensaje.value.trim().length > 0 ? '' : 'Escribí un mensaje.'
    ];
    var primerError = null;
    resultado.textContent = '';
    campos.forEach(function (campo, indice) {
        document.getElementById('error-' + campo.id).textContent = errores[indice];
        campo.setAttribute('aria-invalid', errores[indice] ? 'true' : 'false');
        campo.setAttribute('aria-describedby', 'error-' + campo.id);
        if (errores[indice] && primerError === null) {
            primerError = campo;
        }
    });
    if (primerError !== null) {
        primerError.focus();
        return;
    }
    resultado.textContent = 'Los datos son válidos. Este formulario de demostración no envía mensajes.';
});
