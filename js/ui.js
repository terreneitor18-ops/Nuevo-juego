/**
 * ui.js
 * Toda la manipulación del DOM vive acá. Este módulo lee el gameState
 * y los datos de escena ya resueltos (world.js) y los pinta en pantalla.
 * No contiene lógica de juego: solo renderizado y captura de eventos de click,
 * que delega hacia afuera vía callbacks.
 */

const el = {
  loadingScreen: () => document.getElementById('loading-screen'),
  loadingError: () => document.getElementById('loading-error'),
  scenePanel: () => document.getElementById('scene-panel'),
  sceneTitle: () => document.getElementById('scene-title'),
  sceneText: () => document.getElementById('scene-text'),
  sceneImage: () => document.getElementById('scene-image'),
  sceneOptions: () => document.getElementById('scene-options'),
  playerStatusBar: () => document.getElementById('player-status-bar')
};

/**
 * Oculta la pantalla de carga con una transición suave.
 */
export function ocultarPantallaCarga() {
  const pantalla = el.loadingScreen();
  pantalla.classList.add('hidden');
  // Se remueve del flujo del DOM tras la transición para no bloquear clicks.
  setTimeout(() => {
    pantalla.style.display = 'none';
  }, 650);
}

/**
 * Muestra un error fatal en la pantalla de carga (ej: falló el fetch de datos).
 * @param {string} mensaje
 */
export function mostrarErrorCarga(mensaje) {
  const errorEl = el.loadingError();
  errorEl.textContent = mensaje;
  errorEl.style.display = 'block';
}

/**
 * Renderiza una escena completa en el panel principal.
 * @param {object} escena - escena resuelta (con opciones ya filtradas)
 * @param {(opcionId: string) => void} onElegirOpcion - callback al clickear una opción
 */
export function renderizarEscena(escena, onElegirOpcion) {
  const panel = el.scenePanel();
  panel.classList.remove('scene-fade-enter');
  // Forzamos reflow para poder re-disparar la animación en escenas consecutivas.
  void panel.offsetWidth;
  panel.classList.add('scene-fade-enter');

  el.sceneTitle().textContent = escena.titulo;
  el.sceneText().textContent = escena.descripcion;

  const imagenEl = el.sceneImage();
  if (escena.imagen) {
    imagenEl.src = escena.imagen;
    imagenEl.classList.remove('hidden');
  } else {
    imagenEl.classList.add('hidden');
  }

  const contenedorOpciones = el.sceneOptions();
  contenedorOpciones.innerHTML = '';

  escena.opciones.forEach((opcion, index) => {
    const boton = document.createElement('button');
    boton.className = 'option-button';
    boton.style.animationDelay = `${index * 60}ms`;
    boton.textContent = opcion.texto;
    boton.addEventListener('click', () => onElegirOpcion(opcion.id));
    contenedorOpciones.appendChild(boton);
  });
}

/**
 * Renderiza la barra de estado del personaje (header con HP/Mana/Energía).
 * @param {object} player
 */
export function renderizarStatusBar(player) {
  const barra = el.playerStatusBar();

  const pct = (actual, max) => Math.round((actual / max) * 100);

  barra.innerHTML = `
    <div class="status-row">
      <span class="status-name">${player.nombre}</span>
      <span class="status-level">Nv. ${player.nivel}</span>
    </div>
    <div class="status-row">
      <span class="stat-label">Vida</span>
      <div class="stat-bar hp">
        <div class="stat-bar-fill" style="width: ${pct(player.vida, player.vidaMaxima)}%"></div>
      </div>
      <span class="stat-label">${player.vida}/${player.vidaMaxima}</span>
    </div>
    <div class="status-row">
      <span class="stat-label">Mana</span>
      <div class="stat-bar mana">
        <div class="stat-bar-fill" style="width: ${pct(player.mana, player.manaMaximo)}%"></div>
      </div>
      <span class="stat-label">${player.mana}/${player.manaMaximo}</span>
    </div>
    <div class="status-row">
      <span class="stat-label">Energía</span>
      <div class="stat-bar energy">
        <div class="stat-bar-fill" style="width: ${pct(player.energia, player.energiaMaxima)}%"></div>
      </div>
      <span class="stat-label">${player.energia}/${player.energiaMaxima}</span>
    </div>
  `;
}
