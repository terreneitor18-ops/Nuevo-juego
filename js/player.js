/**
 * player.js
 * Define la estructura del personaje jugable y funciones puras para
 * manipularla (subir de nivel, modificar stats, etc.). No sabe nada
 * de UI ni de escenas — solo maneja el modelo de datos del jugador.
 */

import { clamp } from './utils.js';

/**
 * Crea un objeto de personaje nuevo con valores base.
 * Este es el "molde" inicial; en fases futuras esto se va a poder
 * parametrizar por clase elegida al empezar una partida.
 *
 * @param {string} nombre
 * @returns {object} player state
 */
export function crearPersonajeInicial(nombre = 'Aventurero') {
  return {
    nombre,
    nivel: 1,
    experiencia: 0,
    experienciaSiguienteNivel: 100,

    vida: 30,
    vidaMaxima: 30,
    mana: 10,
    manaMaximo: 10,
    energia: 20,
    energiaMaxima: 20,

    oro: 20,

    atributos: {
      fuerza: 5,
      destreza: 5,
      inteligencia: 5,
      constitucion: 5,
      carisma: 5,
      percepcion: 5,
      suerte: 5
    },

    // inventario: { objeto_id: cantidad }
    inventario: {},

    // equipo: slots fijos, valor = objeto_id o null
    equipo: {
      arma: null,
      armadura: null,
      accesorio: null
    },

    // reputacion: { faccion_id: valor numérico }
    reputacion: {},

    // relaciones: { npc_id: valor numérico }
    relaciones: {},

    // estados alterados activos: [{ id, duracion, ... }]
    estados: [],

    // logros desbloqueados: [logro_id, ...]
    logros: []
  };
}

/**
 * Aplica daño a la vida del jugador, respetando el piso de 0.
 * @param {object} player
 * @param {number} cantidad
 */
export function aplicarDanio(player, cantidad) {
  player.vida = clamp(player.vida - cantidad, 0, player.vidaMaxima);
}

/**
 * Cura al jugador, respetando el techo de vidaMaxima.
 * @param {object} player
 * @param {number} cantidad
 */
export function curar(player, cantidad) {
  player.vida = clamp(player.vida + cantidad, 0, player.vidaMaxima);
}

/**
 * Modifica la reputación del jugador con una facción determinada.
 * @param {object} player
 * @param {string} faccion
 * @param {number} valor - delta a aplicar (puede ser negativo)
 */
export function modificarReputacion(player, faccion, valor) {
  if (!player.reputacion[faccion]) player.reputacion[faccion] = 0;
  player.reputacion[faccion] += valor;
}

/**
 * Agrega un objeto al inventario del jugador.
 * @param {object} player
 * @param {string} objetoId
 * @param {number} cantidad
 */
export function darObjeto(player, objetoId, cantidad = 1) {
  player.inventario[objetoId] = (player.inventario[objetoId] || 0) + cantidad;
}

/**
 * Quita un objeto del inventario del jugador. No baja de 0.
 * @param {object} player
 * @param {string} objetoId
 * @param {number} cantidad
 * @returns {boolean} true si se pudo quitar la cantidad completa
 */
export function quitarObjeto(player, objetoId, cantidad = 1) {
  const actual = player.inventario[objetoId] || 0;
  if (actual < cantidad) return false;

  player.inventario[objetoId] = actual - cantidad;
  if (player.inventario[objetoId] <= 0) delete player.inventario[objetoId];
  return true;
}
