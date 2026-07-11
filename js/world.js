/**
 * world.js
 * Motor de escenas. No sabe nada de UI ni de renderizado — su única
 * responsabilidad es: dado un ID de escena, devolver los datos de esa
 * escena filtrando las opciones que no cumplen sus condiciones, y
 * saber cómo avanzar el gameState cuando el jugador elige una opción.
 */

import { evaluarCondiciones } from './utils.js';
import { ejecutarEfectos } from './events.js';

/**
 * Obtiene los datos de una escena por su ID, con las opciones ya
 * filtradas según las condiciones actuales del gameState.
 *
 * @param {string} escenaId
 * @param {object} gameState
 * @returns {object} escena con .opciones filtradas
 */
export function obtenerEscena(escenaId, gameState) {
  const escena = gameState.data.scenes[escenaId];

  if (!escena) {
    throw new Error(`[world] Escena no encontrada: "${escenaId}"`);
  }

  const opcionesVisibles = escena.opciones.filter((opcion) =>
    evaluarCondiciones(opcion.condiciones, gameState)
  );

  return {
    ...escena,
    opciones: opcionesVisibles
  };
}

/**
 * Procesa la elección de una opción por parte del jugador:
 * ejecuta sus efectos y devuelve el ID de la siguiente escena.
 *
 * @param {string} escenaId - escena actual
 * @param {string} opcionId - id de la opción elegida
 * @param {object} gameState
 * @returns {{ siguienteEscenaId: string, mensajes: Array<string> }}
 */
export function elegirOpcion(escenaId, opcionId, gameState) {
  const escena = gameState.data.scenes[escenaId];
  if (!escena) {
    throw new Error(`[world] Escena no encontrada: "${escenaId}"`);
  }

  const opcion = escena.opciones.find((o) => o.id === opcionId);
  if (!opcion) {
    throw new Error(`[world] Opción "${opcionId}" no encontrada en escena "${escenaId}"`);
  }

  const mensajes = ejecutarEfectos(opcion.efectos, gameState);

  return {
    siguienteEscenaId: opcion.siguiente_escena,
    mensajes
  };
}
