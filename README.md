# RPG Narrativo

RPG narrativo basado en decisiones, sin IA, sin texto libre — el jugador
interactúa únicamente mediante opciones diseñadas. HTML5 + CSS3 + JavaScript
ES6+ puro, sin frameworks. Contenido 100% data-driven vía JSON.

## Estado del proyecto: Fase 1 — Esqueleto base

Esta fase valida el pipeline completo: carga de datos JSON vía `fetch()`,
motor de escenas, renderizado, y guardado automático en `localStorage`.
Incluye 4 escenas de prueba interconectadas para verificar que todo funciona
de punta a punta.

## Cómo correrlo

Este proyecto usa módulos ES6 (`import`/`export`) y `fetch()` de archivos
locales, por lo que **no funciona abriendo `index.html` directo desde el
disco** (protocolo `file://`). Necesita servirse por HTTP.

**Recomendado: GitHub Pages**
1. Andá a Settings → Pages en tu repo.
2. Elegí la rama `main` y la carpeta raíz (`/`).
3. Esperá 1-2 minutos y abrí la URL que te da GitHub.

## Estructura de carpetas
