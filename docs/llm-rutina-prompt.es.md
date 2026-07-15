# Cómo crear una Rutina con un LLM

Esta guía convierte un programa de entrenamiento que solo existe en tu cabeza (o en las
notas de un entrenador) en un archivo `rutina.json`. Rellena el prompt en la parte
superior de esta pantalla, cópialo en **cualquier** chat LLM (ChatGPT, Claude, Gemini,
lo que tengas a mano) e importa la respuesta en la aplicación **Rutina**.

No se requieren conocimientos de JSON. Sin cuenta, sin clave API — funciona en una
ventana de chat de navegador normal.

Todos los datos de referencia están en el repositorio público
[github.com/bthos/gym-routine-basic-fit](https://github.com/bthos/gym-routine-basic-fit).
El prompt indica al LLM dónde leerlos — **no** necesitas copiar tú mismo el esquema ni
los archivos de equipamiento.

| Dato | URL |
|------|-----|
| Esquema (fuente de verdad) | [rutina.schema.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/schema/rutina.schema.json) |
| Catálogo de equipamiento | [equipment.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/equipment.json) |
| Lista de gimnasios (para el LLM) | [gyms.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/gyms.json) |
| Ejemplo de referencia | [phase1-monday.json](https://raw.githubusercontent.com/bthos/gym-routine-basic-fit/main/data/examples/phase1-monday.json) |

> **¿LLM sin acceso web?** Descarga los cuatro archivos de datos del repositorio y
> adjúntalos manualmente al chat. El prompt ya nombra cada archivo.

## Cómo funciona

```
1. Rellena la sección REQUEST al inicio del prompt (el recuadro del listado de gimnasios está debajo)
2. Copia todo el prompt y pégalo en cualquier chat LLM
3. Copia la respuesta JSON del LLM
4. Importa en la app Rutina (pegar o subir .json)
      ✓ pasa  → listo
      ✗ falla → copia los errores de validación de vuelta al LLM, pídele que corrija
                y vuelva a generar el JSON completo, vuelve al paso 4
```

El bucle de corrección del paso 4 es el mecanismo de fiabilidad. Los mensajes de error
están escritos para pegarlos directamente en el chat.

Validación local sin la app: `npm run validate-rutina -- ruta/a/rutina.json`

---

## Paso 1 — Copia el prompt

Usa el botón **Copiar** encima de esta guía. El prompt empieza por **REQUEST** — rellena
cada línea numerada (texto simple, sin JSON) antes de enviar.

> **Campo 6 — gimnasio objetivo**
> Busca el nombre y el **id** numérico de tu gimnasio en el **[listado de gimnasios →](https://bthos.github.io/gym-routine-basic-fit/gyms.html)**
> (se abre en una pestaña nueva). También está en la pestaña **Catálogo** de la app Rutina.

| # | Campo | Ejemplo | Requerido |
|---|-------|---------|-----------|
| 1 | Para quién es / nombre del programa | "Elena — Fase 2" | sí |
| 2 | Objetivo principal en esta fase | "Hipertrofia, más volumen" | sí |
| 3 | Días por semana | 4 | sí |
| 4 | Presupuesto de duración de sesión | "45-60 min" | sí |
| 5 | Lesiones / movimientos a evitar | "Evitar press militar por hombro derecho" | no — escribe "ninguna" si no hay |
| 6 | Gimnasio objetivo | "Avda. Andalucía, Centro Comercial Alameda (id 3)" | sí |
| 7 | Idioma para el texto de salida | "Español" | sí |
| 8 | Exportación de progreso previo | Markdown de **Historial → Exportar** en Rutina | no — omite si es la primera fase |

Incluir "devuelve solo JSON, nada más" tanto al principio (`ROLE`) como al final
(`OUTPUT`) es deliberado — es la instrucción de mayor impacto para obtener una salida
parseable de un LLM ajustado para chat.

## Paso 2 — Importa en la app Rutina

1. Copia la respuesta JSON del LLM (sin vallas de markdown).
2. Abre la pantalla **Importar** en la app Rutina y pégala, o sube un archivo `.json`.
3. Pulsa **Importar**. La app valida contra el mismo esquema y catálogo de equipamiento.

Si la validación falla, copia la lista de errores de la app y pégala de vuelta en el
chat del LLM como siguiente mensaje. Pídele que corrija y vuelva a generar el JSON
completo. Repite hasta que la importación funcione.

**Opcional — validar en tu ordenador:**

```bash
npm run validate-rutina -- ruta/a/tu-rutina.json
```

| Resultado | Ejemplo de salida | Qué hacer |
|---|---|---|
| Éxito | `✓ Valid rutina: 4 days, 22 exercises` | Importar en la app |
| Error de esquema | `days[1].label: required` | Pegar todo el bloque de error de vuelta al LLM |
| Error de ID de equipamiento | `days[2].exercises[0].equipmentId "g3-xx" not found in data/equipment.json` | Igual — pegar literalmente |

---

## Ejemplo práctico (un turno completo)

**REQUEST rellenado (inicio del prompt copiado):**

```text
1. Para quién es / nombre del programa: Elena Rois — Fase 2
2. Objetivo principal en esta fase: Hipertrofia, más volumen muscular
3. Días por semana: 4
4. Presupuesto de duración de sesión: 45-60 min
5. Lesiones / movimientos a evitar: ninguna
6. Gimnasio objetivo: Avda. Andalucía, Centro Comercial Alameda (id 3)
7. Idioma para el texto de salida: Español
8. Exportación de progreso previo (opcional): (ninguna todavía, primera vez usando esto)
```

**El LLM lee esquema y equipamiento desde las URLs en DATA SOURCES y devuelve JSON.**

**Importar** en la app Rutina, o ejecutar `npm run validate-rutina -- data/rutina-nombre-fase2-draft.json`.

---

## Solución de problemas

- **El LLM no puede obtener URLs.** Adjunta manualmente los cuatro archivos de DATA
  SOURCES, o pega su contenido en el chat.
- **El LLM añadió una introducción o envolvió el JSON en una valla de markdown.**
  Reenvía con: "Output ONLY the JSON object, no markdown fence, no explanation."
- **La respuesta se cortó a la mitad del JSON (programas muy largos).** Pide al LLM
  que "continúe desde donde paró, siguiendo generando solo JSON".
- **ID de equipamiento no encontrado.** El LLM debe elegir ids de `equipment.json` cuyo
  array `gyms` incluya tu id de gimnasio. Pega el error del validador y pídele que relea el catálogo.
- **¿No sabes el id de tu gimnasio?** Abre la [lista de gimnasios](https://bthos.github.io/gym-routine-basic-fit/gyms.html) o la pestaña **Catálogo** en la app Rutina.

---

## Actualizar tu programa

Una vez que hay un programa cargado, puedes reemplazarlo o eliminarlo desde la pestaña **Programa**:

1. Ve a la pestaña **Programa** y desplázate hasta el final de la vista general.
2. Pulsa **Reemplazar programa** para ir a la pantalla de importación y pegar un nuevo rutina.json.
3. O pulsa **Eliminar programa** para borrar el programa activo y volver al estado inicial.

El historial de sesiones se conserva al eliminar — los registros se mantienen pero ya no estarán vinculados a un programa.
