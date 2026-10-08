# Memotest Discografía Redonda

Proyecto de examen final de Desarrollo y Arquitecturas Web 2026. Juego de memoria con portadas de Los Redondos y proyectos vinculados a su discografía, con una estética roja y negra inspirada en *Oktubre*.

## Cómo se juega

1. Ingresá un nombre de jugador de al menos tres caracteres y elegí una dificultad.
2. Memorizá las cartas durante la vista previa de 2,5 segundos. Durante ese lapso no se pueden seleccionar.
3. Elegí dos cartas. Cada segunda selección válida cuenta como un intento.
4. Si coinciden, quedan descubiertas. Si no coinciden, se registra un error y se ocultan después de un segundo; durante esa espera se bloquea el tablero.
5. Encontrá todos los pares para finalizar y guardar el resultado en el ranking local.

El temporizador empieza al seleccionar la primera carta después de la vista previa. La duración final se calcula desde ese instante, incluso si un callback del intervalo se demora. Los modales no pausan el tiempo de una partida iniciada.

| Dificultad | Pares | Cartas | Penalización por error |
| --- | ---: | ---: | ---: |
| Fácil | 8 | 16 | 10 puntos |
| Medio | 10 | 20 | 20 puntos |
| Difícil | 18 | 36 | 30 puntos |

## Puntaje

El puntaje comienza en cero. Cada pareja correcta suma **100 puntos**. Cada error actualiza el puntaje a **máximo(0, puntaje actual − penalización del nivel)**. Al completar el tablero se suman **300 puntos**, una sola vez. No hay penalización por tiempo.

El mínimo de cero se aplica después de cada error: no corresponde restar todos los errores al final, porque los errores cometidos sin puntos no generan deuda. Una partida perfecta obtiene 1100 puntos en fácil, 1300 en medio y 2100 en difícil.

## Funcionalidades

- Tablero generado dinámicamente, selección aleatoria de discos y mezcla Fisher–Yates.
- Validación del catálogo antes de iniciar o reiniciar: cantidad suficiente, identificadores e imágenes únicos. Cada disco seleccionado genera exactamente dos cartas. Un catálogo inválido muestra un error y vuelve al inicio.
- Giro 3D, vista previa y bloqueo mientras se resuelve una pareja incorrecta.
- Tiempo, puntaje, intentos, errores y pares encontrados visibles.
- Reinicio y abandono mediante modales propios, sin recargar la página y cancelando las esperas anteriores.
- Resultado final y nueva partida con el mismo nombre y dificultad.
- Ranking en localStorage: guarda solo partidas terminadas, sin duplicar resultados. Se puede ordenar por puntaje descendente, fecha más reciente, menor duración o nivel de difícil a fácil. Borrado con confirmación y avisos si el almacenamiento falla.
- Contacto con validación JavaScript y errores junto a los campos. El nombre admite letras españolas y números, sin espacios internos ni símbolos; se recortan espacios exteriores. El mensaje debe superar cinco caracteres después del recorte.
- Contacto prepara un enlace mailto con asunto y cuerpo codificados. Intenta abrir el cliente de correo; no envía mensajes automáticamente. Como no se proporcionó una dirección receptora verificada, el usuario completa el destinatario en el cliente de correo.
- Diseño con Flexbox, adaptación responsive y preferencia de movimiento reducido.

## Tecnologías

HTML5, CSS3 y JavaScript ES5 con modo estricto. Sin frameworks ni dependencias externas de ejecución. Eventos registrados con addEventListener. La suite local utiliza únicamente módulos incluidos en Node.js; Node no es necesario para jugar.

## Estructura

```text
.
├── index.html
├── pages/
│   └── contact.html
├── css/
│   ├── reset.css
│   ├── styles.css
│   ├── game.css
│   ├── modal.css
│   └── responsive.css
├── js/
│   ├── validation.js
│   ├── ui.js
│   ├── game.js
│   ├── board.js
│   ├── storage.js
│   ├── ranking.js
│   ├── main.js
│   └── contact.js
├── assets/images/
│   ├── logo/
│   └── portadas/
├── tests/
│   └── verificar.js
├── .gitignore
└── README.md
```

## Ejecución local

1. Cloná o descargá el repositorio conservando su estructura de carpetas.
2. Serví la carpeta raíz mediante un servidor HTTP estático. Si tenés Python instalado, ejecutá desde esa carpeta:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

3. Abrí http://127.0.0.1:8000/ en el navegador. También podés usar un servidor estático de tu editor.

No se requieren instalación de paquetes, compilación ni backend. Abrir index.html directamente puede depender de las políticas del navegador para localStorage; se recomienda HTTP. El ranking pertenece al navegador y al origen utilizado, no se sincroniza entre equipos y puede desaparecer al borrar datos de navegación. Para Contacto se necesita una aplicación configurada para enlaces mailto.

## Pruebas

Con Node.js instalado, desde la raíz:

```sh
node tests/verificar.js
```

La suite verifica comportamiento con DOM, reloj y almacenamiento simulados: las tres dificultades, parejas, mezcla, bloqueos, puntaje, estadísticas, reinicio, persistencia y orden visible del ranking, duración final con intervalo demorado, contacto y catálogo insuficiente o duplicado. El conteo incluye comprobaciones repetidas de IDs y scripts al crear cada entorno; no representa esa misma cantidad de escenarios independientes.

Estas pruebas no sustituyen una revisión visual ni demuestran que el sistema operativo abrió el cliente de correo.

## Repositorio y publicación

Repositorio: [CabralPedro1/cabral_pedro_daw_examen_final](https://github.com/CabralPedro1/cabral_pedro_daw_examen_final).

GitHub Pages pendiente de verificación. La URL prevista es `https://cabralpedro1.github.io/cabral_pedro_daw_examen_final/`, pero no se pudo confirmar su disponibilidad desde el entorno de revisión. No se declara publicado ni se agregan enlaces de publicación a las pantallas hasta comprobarlo.

## Autoría

Identificador de autor verificado en el historial Git: **CabralPedro2AN**. El repositorio indicado pertenece a **CabralPedro1**. No se consignan nombres completos ni datos de contacto sin verificar.

## Comprobaciones pendientes

- Confirmar GitHub Pages y navegación/rutas desde la publicación; luego incorporar su enlace en ambas páginas y en este documento.
- Revisar las tres dificultades en navegador, en escritorio y móvil, incluyendo el giro sin desplazamiento, dimensiones, modales y ausencia de errores de consola. Se conserva la alineación del frente y dorso y el cálculo de tamaños existente.
- Probar la apertura real del cliente de correo y completar/configurar una dirección receptora si corresponde.
- Resolver el conflicto entre la prohibición de estilos inline y el dimensionamiento dinámico de js/board.js. Actualmente asigna ancho y alto mediante .style. Una alternativa es actualizar reglas de una hoja CSS mediante CSSOM o reemplazar el cálculo por clases y reglas responsive; ambas requieren comprobar visualmente todos los niveles y tamaños. Se conserva la solución funcional y el reemplazo queda pendiente de autorización y validación visual.
