# Frontend React + TypeScript

Este proyecto usa [Vite](https://vitejs.dev/) para crear una aplicación de React en TypeScript que consume la API descrita en el README principal.

## Scripts

- `npm run dev` inicia el servidor de desarrollo de Vite.
- `npm run build` genera la versión de producción.
- `npm run preview` sirve la versión de producción generada.

Antes de ejecutar los comandos instala las dependencias con `npm install` (se necesita conexión a internet).

## Configuración OAuth

1. Crea credenciales OAuth 2.0 en Google Cloud y reemplaza `CLIENT_ID` en `src/App.tsx` con tu propio ID.
2. El dominio donde sirvas esta aplicación debe estar permitido en los orígenes autorizados de Google Cloud.

## Uso

1. Haz clic en **"Autenticarse con Google"** para obtener un `access_token` con el scope `https://mail.google.com/`.
2. Completa el formulario con los datos del acta.
3. Al enviar se hace una petición `POST` a `http://localhost:8001/send-acta` incluyendo el token y el correo del usuario autenticado.

Recuerda no almacenar el `access_token` en localStorage. El token se guarda únicamente en memoria mientras la aplicación esté abierta.
