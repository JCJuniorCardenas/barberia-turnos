## Convenciones del proyecto

- El backend vive en `backend/` y usa NestJS, TypeScript, TypeORM y PostgreSQL.
- Mantener módulos por dominio (`servicios`, `horarios`, `turnos` y `auth`).
- Usar DTOs con `class-validator` y activar `whitelist` en la validación global.
- Mantener la documentación de endpoints con Swagger.
- No incluir secretos ni archivos `.env` en el repositorio.
- La aplicación es single-tenant por ahora; evitar introducir complejidad multi-tenant.
