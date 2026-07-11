/**
 * game.js
 * Dueño del gameState (single source of truth) y del proceso de carga
 * inicial de todos los archivos JSON de datos. Expone funciones para
 * crear una partida nueva y para acceder/mutar el estado de forma controlada.
 */

import { crearPersonajeInicial } from './player.js';

/**
 * Lista de archivos de datos que se cargan al iniciar el juego.
 * Agregar un nuevo tipo de contenido (ej: "npcs") = agregar una línea acá
 * y crear el .json correspondiente en /data. No requiere tocar más nada
 * de la lógica de carga.
 */
const ARCHIVOS_DATA = {
  scenes: 'data/scenes.json',
  items: 'data/items.json'
  // Próximas fases: enemies, npcs, quests, locations, events, dialogues
};

/**
 * Carga todos los archivos JSON de /data en paralelo.
 * @returns {Promise<object>} objeto con cada dataset, indexado por clave
 */
export async function cargarDatosDelJuego() {
  const entradas = Object.entries(ARCHIVOS_DATA);

  const resultados = await Promise.all(
    entradas.map(async ([clave, ruta]) => {
      const respuesta = await fetch(ruta);
      if (!respuesta.ok) {
        throw new Error(`No se pudo cargar ${ruta} (HTTP ${respuesta.status})`);
      }
      const json = await respuesta.json();
      return [clave, json];
    })
  );

  return Object.fromEntries(resultados);
}

/**
 * Crea un gameState nuevo para el arranque de una partida.
 * @param {object} data - datasets ya cargados (retorno de cargarDatosDelJuego)
 * @returns {object} gameState inicial
 */
export function crearNuevaPartida(data) {
  return {
    data, // datasets estáticos: scenes, items, enemies, etc. (no se guardan en save)
    player: crearPersonajeInicial('Aventurero'),
    escenaActual: 'inicio_camino',
    flags: {},
    quests: {
      activas: [],
      completadas: []
    }
  };
}
