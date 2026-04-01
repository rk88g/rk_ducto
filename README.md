# RK - Ducto Salamanca

Base inicial del proyecto con:

- `frontend/` en Next.js pensado para desplegarse en Vercel.
- `backend/` en Express pensado para desplegarse en Railway.
- `login` como primera vista.
- `mapa` protegido para clientes autenticados.

## Flujo actual

1. El usuario entra a `/`.
2. Ve el formulario de login.
3. El frontend manda `username` y `password` al backend.
4. Si el backend valida el acceso, devuelve un token.
5. El frontend guarda la sesion en cookie y redirige a `/map`.
6. La vista `/map` valida el token y muestra el Google Maps embed.

## Variables de entorno

### Frontend

Copia `frontend/.env.example` a `frontend/.env.local` y define:

- `NEXT_PUBLIC_API_BASE_URL`: URL publica del backend en Railway.
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`: URL embed completa del mapa de Google Maps.

### Backend

Copia `backend/.env.example` a `backend/.env` y define:

- `PORT`: puerto del backend.
- `CORS_ORIGIN`: origen del frontend, por ejemplo `http://localhost:3000` o tu dominio de Vercel.
- `JWT_SECRET`: secreto para firmar sesiones.
- `TOKEN_DURATION`: duracion del token.
- `AUTHORIZED_USERS_JSON`: arreglo JSON con maximo 5 usuarios.

Ejemplo:

```json
[
  {
    "username": "cliente01",
    "password": "demo123",
    "name": "Cliente 01"
  },
  {
    "username": "cliente02",
    "password": "demo456",
    "name": "Cliente 02"
  }
]
```

## Comandos

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Lo que falta para dejarlo listo contigo

- Que me pases los usuarios finales.
- Que me pases la URL embed de Google Maps que quieres mostrar.
- Si quieres, en el siguiente paso puedo endurecer la seguridad para no guardar contrasenas en texto plano y dejar el backend listo para produccion.

## Deploy

### Railway

Si Railway esta conectado al repositorio completo y despliega desde la raiz, ya puede usar el [Dockerfile](/C:/Users/rk88g/Documents/GitHub/rk_ducto/Dockerfile) del root para levantar el backend sin depender de autodeteccion.

Variables recomendadas en Railway:

- `JWT_SECRET`
- `CORS_ORIGIN`
- `AUTHORIZED_USERS_JSON`
- `TOKEN_DURATION`

Si prefieres usar Railway en modo monorepo sin Docker, tambien puedes configurar el servicio con:

- `Root Directory`: `/backend`
- `Watch Paths`: `/backend/**`

### Vercel

En Vercel configura el proyecto para que use como root directory `frontend/`.

Si hoy ves `404: NOT_FOUND` en `rk-ducto.vercel.app`, eso normalmente significa que Vercel desplego el repositorio desde la raiz en lugar de `frontend/`.

Configuracion esperada en Vercel:

- `Root Directory`: `frontend`
- `Framework Preset`: `Next.js`

Despues de guardar esos cambios, vuelve a hacer un redeploy.
