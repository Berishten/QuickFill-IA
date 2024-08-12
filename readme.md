# QuickFill-AI
#### **Fill out web forms in seconds using personalized contexts**

A browser plugin simplifies and accelerates the process of filling out any type of online form. Select a form, provide a context such as a report, a CV, or a role, and let our plugin automatically complete the fields. Ideal for reducing time spent on repetitive tasks, whether for job applications, bureaucratic procedures, or everyday forms. Coming soon with more features, like adding an image as context to extend the possibilities.

[Link de competición](https://ai.google.dev/competition)

---

### Características principales
- [x] Detección de pares (label - input)
- [x] Rellenar inputs con LLM


### TODO:
- [ ] Login
- [ ] Input de contexto
- [ ] Subir archivo [Detalles tecnicos](https://ai.google.dev/gemini-api/docs/document-processing?authuser=1&lang=node)
- [ ] Seleccionar idioma
- [ ] Escribir condiciones de uso
- [ ] Cubrir casos de accesibilidad
- [ ] Casos para heurística de pares
    - [x] Input
    - [x] Textarea
    - [x] Select
    - [ ] Radio (a revisar, baja prioridad)
    - [ ] Checkbox (a revisar, baja prioridad)
    - [ ] Date (a revisar, baja prioridad)
- [ ] Estilizar
    - [ ] Pantalla loading sobre formulario
- [ ] Seguridad
    - [ ] Sanitizar html enviado al servidor
    - [ ] Protección de datos del usuario
    - [ ] Prompt injection
    - [ ] Model API token

### NICE TO HAVE
- [ ] Permitir contexto en formato imagen [Detalles tecnicos](https://ai.google.dev/gemini-api/docs/vision?authuser=1&lang=node)
- [ ] Permitir contexto en formato audio [Detalles tecnicos](https://ai.google.dev/gemini-api/docs/audio?authuser=1&lang=node)
- [ ] Permitir contexto por medio de fotos de la cámara
- [ ] Permitir rellenar por campos de forma atómica
- [ ] Agregar opciones extra como:
    - [ ] Limpiar formulario antes de rellenar
    - [ ] Limpiar todo el Popup o cada campo
    - [ ] Opción para mantener campos que ya estén llenos

### Documentación
[Link al formulario de competencia](https://docs.google.com/forms/d/e/1FAIpQLSczzeNmPUo6yiS_TfULziyEO8gzc1WFYX3yal62KzrQgeoa1g/viewform?embedded=true&pli=1)
- [x] App name
- [x] App tagline or elevator pitch
- [ ] YouTube URL
- [ ] Website or web app URL (publicar en chrome extensions)
- [ ] Testing instructions
- [x] Team name (ByeBytes)

## KNOWN ISSUES
- Quedan algunos estilos del hover al presionar el boton Cancelar
- "Modo detectar" (botón Cancel) no se mantiene al reabrir el popup
