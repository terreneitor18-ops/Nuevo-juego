/**
 * save.js
 * Sistema de guardado/carga de partidas usando localStorage.
 * Soporta múltiples slots de guardado manual + un slot de autoguardado.
 * No sabe nada de UI: solo persiste y recupera el gameState tal cual se le pasa.
 */

const PREFIX = 'rpg_narrativo_save_';
const AUTOSAVE_KEY = `${PREFIX}auto`;
const SLOT_KEY = (n) => `${PREFIX}slot_${n}`;
const INDEX_KEY = `${PREFIX}index`;

/**
 * Guarda el estado del juego en un slot específico.
 * @param {object} gameState
 * @param {number} slot - número de slot (1, 2, 3...)
 */
export function guardarEnSlot(gameState, slot) {
  const payload = {
    gameState,
    timestamp: Date.now(),
    version: 1
  };
  localStorage.setItem(SLOT_KEY(slot), JSON.stringify(payload));
  actualizarIndice(slot);
}

/**
 * Guardado automático: siempre pisa el mismo slot reservado.
 * @param {object} gameState
 */
export function autoguardar(gameState) {
  const payload = {
    gameState,
    timestamp: Date.now(),
    version: 1
  };
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
}

/**
 * Carga el estado guardado en un slot específico.
 * @param {number} slot
 * @returns {object|null} el gameState guardado, o null si no existe
 */
export function cargarDeSlot(slot) {
  const raw = localStorage.getItem(SLOT_KEY(slot));
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw);
    return payload.gameState;
  } catch (err) {
    console.error(`[save] Error al parsear el slot ${slot}:`, err);
    return null;
  }
}

/**
 * Carga el autoguardado más reciente.
 * @returns {object|null}
 */
export function cargarAutoguardado() {
  const raw = localStorage.getItem(AUTOSAVE_KEY);
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw);
    return payload.gameState;
  } catch (err) {
    console.error('[save] Error al parsear el autoguardado:', err);
    return null;
  }
}

/**
 * Devuelve metadata de todos los slots ocupados (sin cargar el gameState completo),
 * útil para mostrar una pantalla de "Cargar Partida" con fecha/nombre por slot.
 * @returns {Array<{slot: number, timestamp: number, nombre: string, nivel: number}>}
 */
export function listarSlots() {
  const indice = JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
  const resultado = [];

  for (const slot of indice) {
    const raw = localStorage.getItem(SLOT_KEY(slot));
    if (!raw) continue;

    try {
      const payload = JSON.parse(raw);
      resultado.push({
        slot,
        timestamp: payload.timestamp,
        nombre: payload.gameState?.player?.nombre || 'Desconocido',
        nivel: payload.gameState?.player?.nivel || 1
      });
    } catch {
      // slot corrupto, lo ignoramos
    }
  }

  return resultado.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Elimina un slot de guardado.
 * @param {number} slot
 */
export function borrarSlot(slot) {
  localStorage.removeItem(SLOT_KEY(slot));
  const indice = JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
  const nuevoIndice = indice.filter((s) => s !== slot);
  localStorage.setItem(INDEX_KEY, JSON.stringify(nuevoIndice));
}

/**
 * Mantiene actualizado el índice de slots usados (uso interno).
 * @param {number} slot
 */
function actualizarIndice(slot) {
  const indice = JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
  if (!indice.includes(slot)) {
    indice.push(slot);
    localStorage.setItem(INDEX_KEY, JSON.stringify(indice));
  }
}
