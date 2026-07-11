/**
 * events.js
 * Intérprete genérico de "efectos". Un efecto es una instrucción declarativa
 * que viene desde los archivos JSON (ej: { tipo: "DAR_OBJETO", ... }).
 * Este módulo es el único lugar que sabe "traducir" esos datos en cambios
 * reales sobre el gameState. Agregar una mecánica nueva = agregar un case acá,
 * nunca hay que tocar combat.js, quests.js, world.js, etc. para esto.
 */

import { darObjeto, quitarObjeto, modificarReputacion, aplicarDanio, curar } from './player.js';

/**
 * Ejecuta una lista de efectos sobre el gameState, en orden.
 * @param {Array<object>} efectos
 * @param {object} gameState
 * @returns {Array<string>} lista de mensajes descriptivos generados (para mostrar en UI/log)
 */
export function ejecutarEfectos(efectos, gameState) {
  const mensajes = [];
  if (!efectos || efectos.length === 0) return mensajes;

  for (const efecto of efectos) {
    const mensaje = ejecutarEfecto(efecto, gameState);
    if (mensaje) mensajes.push(mensaje);
  }

  return mensajes;
}

/**
 * Ejecuta un único efecto. Función interna, usada por ejecutarEfectos.
 * @param {object} efecto
 * @param {object} gameState
 * @returns {string|null} mensaje descriptivo, o null si el efecto no genera mensaje
 */
function ejecutarEfecto(efecto, gameState) {
  const { player } = gameState;

  switch (efecto.tipo) {
    case 'DAR_OBJETO': {
      darObjeto(player, efecto.objeto_id, efecto.cantidad || 1);
      const nombreObjeto = gameState.data.items[efecto.objeto_id]?.nombre || efecto.objeto_id;
      return `Obtuviste: ${nombreObjeto}${efecto.cantidad > 1 ? ` x${efecto.cantidad}` : ''}`;
    }

    case 'QUITAR_OBJETO': {
      const exito = quitarObjeto(player, efecto.objeto_id, efecto.cantidad || 1);
      if (!exito) {
        console.warn(`[events] No se pudo quitar ${efecto.objeto_id}: cantidad insuficiente`);
        return null;
      }
      const nombreObjeto = gameState.data.items[efecto.objeto_id]?.nombre || efecto.objeto_id;
      return `Perdiste: ${nombreObjeto}${efecto.cantidad > 1 ? ` x${efecto.cantidad}` : ''}`;
    }

    case 'MODIFICAR_REPUTACION': {
      if (!efecto.valor) return null; // valor 0 = no-op, no genera mensaje
      modificarReputacion(player, efecto.faccion, efecto.valor);
      const signo = efecto.valor > 0 ? '+' : '';
      return `Reputación con ${efecto.faccion}: ${signo}${efecto.valor}`;
    }

    case 'MODIFICAR_ORO': {
      player.oro = Math.max(0, player.oro + efecto.valor);
      const signo = efecto.valor > 0 ? '+' : '';
      return `Oro: ${signo}${efecto.valor}`;
    }

    case 'MODIFICAR_VIDA': {
      if (efecto.valor >= 0) {
        curar(player, efecto.valor);
      } else {
        aplicarDanio(player, Math.abs(efecto.valor));
      }
      return null; // la barra de vida ya refleja el cambio, no hace falta mensaje
    }

    case 'MODIFICAR_ATRIBUTO_TEMPORAL': {
      // Reservado para una fase futura (buffs/debuffs temporales).
      // Por ahora no-op intencional: se deja el case documentado para
      // que quede explícito que este efecto está contemplado en el diseño.
      return null;
    }

    case 'ACTIVAR_FLAG': {
      gameState.flags[efecto.flag] = true;
      return null;
    }

    case 'DESACTIVAR_FLAG': {
      gameState.flags[efecto.flag] = false;
      return null;
    }

    case 'COMPLETAR_MISION': {
      if (!gameState.quests.completadas.includes(efecto.quest_id)) {
        gameState.quests.completadas.push(efecto.quest_id);
        gameState.quests.activas = gameState.quests.activas.filter(
          (id) => id !== efecto.quest_id
        );
      }
      return `Misión completada: ${efecto.quest_id}`;
    }

    case 'INICIAR_MISION': {
      if (
        !gameState.quests.activas.includes(efecto.quest_id) &&
        !gameState.quests.completadas.includes(efecto.quest_id)
      ) {
        gameState.quests.activas.push(efecto.quest_id);
      }
      return `Nueva misión: ${efecto.quest_id}`;
    }

    case 'INICIAR_COMBATE': {
      // combat.js todavía no existe en esta fase — queda como placeholder
      // documentado para que la Fase 2 (sistema de combate) lo implemente.
      console.warn('[events] INICIAR_COMBATE: combat.js aún no implementado (Fase 2)');
      return null;
    }

    default:
      console.warn(`[events] Tipo de efecto desconocido: ${efecto.tipo}`);
      return null;
  }
}
