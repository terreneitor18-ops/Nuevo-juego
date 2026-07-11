/**
 * main.js
 * Punto de entrada de la aplicación. Orquesta: carga de datos -> creación
 * de partida -> primer render -> loop de escenas reaccionando a clicks.
 * No contiene lógica de negocio propia, solo conecta los demás módulos.
 */

import { cargarDatosDelJuego, crearNuevaPartida } from './game.js';
import { obtenerEscena, elegirOpcion } from './world.js';
import {
  ocultarPantallaCarga,
  mostrarErrorCarga,
  renderizarEscena,
  renderizarStatusBar
} from './ui.js';
import { autoguardar } from './save.js';

let gameState = null;

/**
 * Arranca el juego: carga los datos, crea el estado inicial y muestra
 * la primera escena.
 */
async function iniciar() {
  try {
    const data = await cargarDatosDelJuego();
    gameState = crearNuevaPartida(data);

    renderizarStatusBar(gameState.player);
    mostrarEscenaActual();

    ocultarPantallaCarga();
  } catch (error) {
    console.error('[main] Error fatal al iniciar el juego:', error);
    mostrarErrorCarga(
      'No se pudo cargar el juego. Revisá tu conexión y volvé a intentar recargando la página.'
    );
  }
}

/**
 * Renderiza la escena actual del gameState.
 */
function mostrarEscenaActual() {
  const escena = obtenerEscena(gameState.escenaActual, gameState);
  renderizarEscena(escena, manejarEleccionDeOpcion);
}

/**
 * Callback ejecutado cuando el jugador clickea una opción de la escena actual.
 * @param {string} opcionId
 */
function manejarEleccionDeOpcion(opcionId) {
  const { siguienteEscenaId, mensajes } = elegirOpcion(
    gameState.escenaActual,
    opcionId,
    gameState
  );

  if (mensajes.length > 0) {
    // Fase 1: log simple en consola. En una fase futura esto se muestra
    // como notificación/toast en la UI.
    mensajes.forEach((m) => console.log(`[evento] ${m}`));
  }

  gameState.escenaActual = siguienteEscenaId;

  renderizarStatusBar(gameState.player);
  mostrarEscenaActual();
  autoguardar(gameState);
}

document.addEventListener('DOMContentLoaded', iniciar);
