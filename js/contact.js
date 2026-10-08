'use strict';

var formularioContacto = document.getElementById('formulario-contacto');

function construirCorreo(nombre, email, mensaje) {
    var asunto = 'Consulta sobre Memotest - ' + nombre.trim();
    var cuerpo = 'Nombre: ' + nombre.trim() + '\r\n' +
        'Email de contacto: ' + email.trim() + '\r\n\r\n' + mensaje.trim();

    /* Sin destinatario predefinido: lo completa el usuario en su cliente. */
    return 'mailto:?subject=' + encodeURIComponent(asunto) +
        '&body=' + encodeURIComponent(cuerpo);
}

function enviarContacto(evento) {
    var nombre = document.getElementById('nombre-contacto');
    var email = document.getElementById('email-contacto');
    var mensaje = document.getElementById('mensaje-contacto');
    var resultado = document.getElementById('resultado-contacto');
    var campos = [nombre, email, mensaje];
    var errores = [
        validarNombreContacto(nombre.value) ? '' : 'Ingresá un nombre con letras y números, sin espacios ni símbolos.',
        validarEmail(email.value) ? '' : 'Ingresá un email válido.',
        validarMensaje(mensaje.value) ? '' : 'Escribí un mensaje de más de 5 caracteres.'
    ];
    var primerError = null;
    var campo;
    var i;

    evento.preventDefault();
    resultado.textContent = '';
    for (i = 0; i < campos.length; i++) {
        campo = campos[i];
        document.getElementById('error-' + campo.id).textContent = errores[i];
        campo.setAttribute('aria-invalid', errores[i] ? 'true' : 'false');
        campo.setAttribute('aria-describedby', 'error-' + campo.id);
        if (errores[i] && primerError === null) {
            primerError = campo;
        }
    }
    if (primerError !== null) {
        primerError.focus();
        return;
    }
    resultado.textContent = 'Se intentará abrir tu aplicación de correo. Completá el destinatario y enviá el mensaje desde allí. Si no se abre, revisá la configuración de correo del dispositivo.';
    window.location.href = construirCorreo(nombre.value, email.value, mensaje.value);
}

formularioContacto.addEventListener('submit', enviarContacto);
