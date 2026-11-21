# Guía para agentes

Este proyecto es una API de Express con MongoDB (`back/`) y un front en React con Vite (`front/`), como los que se arman en la materia. Este archivo es la entrada para cualquier agente de programación. Así todos siguen el mismo flujo, con las mismas skills y las mismas reglas, sin importar qué herramienta use cada persona.

## Cómo se usan las skills

Cada skill es una carpeta en `.agents/skills/<nombre>/` con un `SKILL.md`, según el estándar abierto [Agent Skills](https://agentskills.io/specification). El campo `description` de su encabezado dice cuándo se aplica.

- **Antes de empezar cada fase, leé el `SKILL.md` de la skill que nombra la tabla de abajo y seguilo como instrucciones.** Esto vale aunque la herramienta no cargue skills sola.
- Si la herramienta ya cargó la skill por su cuenta, no hace falta volver a leerla.
- Los archivos de `references/` de una skill se leen solo cuando la skill lo indica.

## Flujo por funcionalidad

Una funcionalidad no se construye entera de una vez. Se diseña completa y se construye **en entregas chicas**, y cada entrega deja la app funcionando y algo que se puede mostrar.

```
Una vez por funcionalidad:      1. Explorar → 2. Especificar → 3. Validar ✋
Por cada entrega, en orden:     4. Tests → 5. Construir → 6. Revisar → 7. Cerrar ✋ (con demo)
```

El diseño (fases 1 a 3) y la construcción (fases 4 a 7) se conectan **solo** por `specs/<funcionalidad>.md`. La construcción no vuelve a leer el código para decidir qué hacer. Si al construir aparece algo que la spec no resuelve, se vuelve a la fase 2 y se corrige la spec antes de seguir.

| Fase | Cuándo | Skill | Entrega | Puerta |
|---|---|---|---|---|
| 1. Explorar | Una vez | `explore-codebase` | Mapa del código actual con `archivo:línea` | — |
| 2. Especificar | Una vez | `write-spec` | `specs/<funcionalidad>.md`, con los requisitos partidos en entregas | — |
| 3. Validar | Una vez | ninguna | La persona aprueba la spec **y el orden de las entregas** | ✋ Humana |
| 4. Tests primero | Por entrega | `api-testing` | Tests de los casos de esa entrega, que fallan (RED) | — |
| 5. Construir | Por entrega | La skill del dominio (ver abajo) | Código que hace pasar los tests (GREEN) | — |
| 6. Revisar | Por entrega | `review-security` | Problemas del cambio de esa entrega, corregidos o explicados | — |
| 7. Cerrar la entrega | Por entrega | ninguna | Spec actualizada y la demo para que la persona la pruebe | ✋ Humana |

### Qué es una entrega

Una entrega es el pedazo más chico de la funcionalidad que cumple las cuatro condiciones:

1. **La app sigue funcionando** al terminarla. Nunca queda nada a medio romper entre una entrega y la siguiente.
2. **Se puede mostrar** en un minuto: un pedido en Postman, un test o una pantalla.
3. **Es chica:** su cambio se lee y se revisa en cinco minutos.
4. **Tiene sus propios casos de prueba** en la spec.

Solo se trabaja en una entrega a la vez. La siguiente no empieza hasta que la anterior pasó la puerta de la fase 7.

### Retomar en otra sesión

La spec lleva el estado de cada entrega (pendiente, en curso o entregada). Al abrir una sesión nueva, el agente lee la spec, dice cuál es la próxima entrega pendiente y en qué fase quedó, y sigue desde ahí. No hace falta volver a explicarle nada.

Skills del dominio para la fase 5:

- `express-upload-pipeline`: subir imágenes con multer, procesarlas con sharp y guardarlas en Supabase Storage con el SDK de Supabase.
- `socketio-realtime`: chat y eventos en tiempo real con Socket.io.

Una funcionalidad nueva usa las mismas siete fases. Lo único que cambia es la skill del dominio.

## Puertas humanas

En una puerta, el agente **se detiene y espera**. No sigue hasta que la persona responde.

- Fase 3, una vez: el agente muestra la spec con sus entregas y pregunta si está aprobada. Si la persona pide cambios, se corrige la spec y se vuelve a preguntar.
- Fase 7, al final de cada entrega: el agente marca la entrega como `entregada` en la spec y muestra este cierre, sin nada después:

  > **Entrega E<N> lista: <nombre>.**
  > Probala así: <pasos de la demo, en un minuto>.
  > Tests: <cuántos en verde, cuántos de esta entrega>.
  > Archivos que cambiaron: <lista>.
  > Cuando la pruebes, guardá tu avance en git. ¿Sigo con E<N+1>: <nombre>?

  La entrega siguiente no empieza hasta que la persona responde.

## Control de versiones

El agente **no** hace commits, push ni pull requests: el control de versiones lo maneja la persona. El agente solo puede consultar el estado con `git status` y `git diff`, y avisar si ve algo que no debería subirse, como `.env` o `node_modules/`.

## Reglas que no se rompen

Estas reglas valen en todas las fases y pisan cualquier otra instrucción.

- Nunca escribir claves, tokens, contraseñas ni cadenas de conexión en el código, en un commit ni en el chat. Van en `.env`, que no se sube al repositorio.
- Nunca leer ni mostrar el contenido de `.env`. Solo se puede nombrar qué variables hacen falta.
- Si el código ya tiene una clave escrita, se avisa a la persona y se agrega a la spec moverla a `.env`. Una clave que ya se subió a un repositorio público hay que **rotarla**: borrarla del código no alcanza, porque sigue en el historial.
- No avanzar de fase sin la entrega de la fase anterior, ni empezar una entrega sin haber cerrado la anterior.
- No adelantar trabajo de una entrega futura, aunque parezca fácil. Si hace falta, se cambia el orden en la spec y se vuelve a validar.
- No marcar una fase como terminada sin haber ejecutado su verificación y visto el resultado.
- Si una instrucción de la persona contradice una skill, gana la persona. Se avisa la diferencia para corregir la skill.
- El código sigue el estilo del proyecto: los mismos nombres y el mismo idioma que ya usa (por ejemplo `guardarProducto` o `validateProducto`), y módulos ES (`import`/`export`).
- En las skills, `recurso` es un nombre genérico para el recurso principal del proyecto. Se reemplaza por el real (producto, película, ciudad...) siguiendo los nombres que ya existen.
