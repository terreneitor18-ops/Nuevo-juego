/**
 * utils.js
 * Funciones auxiliares genéricas, sin dependencias de otros módulos del juego.
 * Cualquier helper que no tenga estado propio y sea reutilizable va acá.
 */

/**
 * Devuelve un entero aleatorio entre min y max, ambos inclusive.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamp: restringe un valor a un rango [min, max].
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Deep clone simple vía JSON. Suficiente para los objetos de datos
 * del juego (sin funciones, sin referencias circulares).
 * @param {object} obj
 * @returns {object}
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Evalúa un array de condiciones contra el estado del juego.
 * Todas las condiciones deben cumplirse (AND lógico).
 * Se define acá porque tanto events.js como world.js/quests.js
 * necesitan evaluar condiciones sin depender uno del otro.
 *
 * @param {Array<object>} condiciones - lista de condiciones a evaluar
 * @param {object} gameState - estado actual del juego
 * @returns {boolean}
 */
export function evaluarCondiciones(condiciones, gameState) {
  if (!condiciones || condiciones.length === 0) return true;

  return condiciones.every((cond) => {
    switch (cond.tipo) {
      case 'TIENE_OBJETO':
        return (gameState.player.inventario[cond.objeto_id] || 0) >= (cond.cantidad || 1);

      case 'NO_TIENE_OBJETO':
        return (gameState.player.inventario[cond.objeto_id] || 0) < (cond.cantidad || 1);

      case 'REPUTACION_MINIMA':
        return (gameState.player.reputacion[cond.faccion] || 0) >= cond.valor;

      case 'REPUTACION_MAXIMA':
        return (gameState.player.reputacion[cond.faccion] || 0) <= cond.valor;

      case 'NIVEL_MINIMO':
        return gameState.player.nivel >= cond.valor;

      case 'FLAG_ACTIVO':
        return Boolean(gameState.flags[cond.flag]);

      case 'FLAG_INACTIVO':
        return !gameState.flags[cond.flag];

      case 'MISION_COMPLETADA':
        return gameState.quests.completadas.includes(cond.quest_id);

      case 'MISION_ACTIVA':
        return gameState.quests.activas.includes(cond.quest_id);

      default:
        console.warn(`[utils] Tipo de condición desconocido: ${cond.tipo}`);
        return true;
    }
  });
}

/**
 * Formatea un número grande con separador de miles (para oro, XP, etc.)
 * @param {number} n
 * @returns {string}
 */
export function formatNumber(n) {
  return n.toLocaleString('es-AR');
}

/**
 * Pequeño helper para esperar N milisegundos (usado en transiciones/animaciones).
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
