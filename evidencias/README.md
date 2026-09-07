# Evidencias de producto — PlanCity (ECCL SENA)

## Documentos diligenciados (formato Word)

| Archivo | Norma |
|---|---|
| `EVIDENCIA_NORMA_220501095_Plancity.docx` | 220501095 — Diseñar la solución (diseño, UML, prototipo, modelo BD) |
| `EVIDENCIA_NORMA_220501096_Plancity.docx` | 220501096 — Desarrollar la solución (técnico, instructivo, solución) |

- Datos del candidato con placeholders `[NOMBRES Y APELLIDOS]`, `[NÚMERO DE DOCUMENTO]`, `[DD/MM/AAAA]`: reemplazar antes de firmar.
- Capturas del sistema en `capturas/` ya incrustadas en ambos documentos.
- Script SQL del esquema en `plancity-schema.sql` (DDL de las 5 tablas + seed admin con hash placeholder).

## Diagramas (`diagramas/`)

| Fuente | Render | Uso |
|---|---|---|
| `uml-casos-uso.puml` (PlantUML) | `uml-casos-uso.png` | CU-01…CU-11 |
| `uml-clases.mmd` (Mermaid) | `uml-clases.png` | Clases del dominio |
| `uml-secuencia-favorito.mmd` | `uml-secuencia-favorito.png` | Secuencia agregar a favoritos |
| `uml-secuencia-login.mmd` | `uml-secuencia-login.png` | Secuencia inicio de sesión |
| `uml-actividad-crear-evento.mmd` | `uml-actividad-crear-evento.png` | Actividad crear evento |
| `er-base-datos.mmd` | `er-base-datos.png` | ER (5 tablas, PK/FK) |
| `arquitectura.mmd` | `arquitectura.png` | Capas + flujo |

Fuentes: entidades TypeORM, migración `InitSchema1787602695769`, controladores y frontend (`plancity-frontend/src`, `plancity-api/src`).
