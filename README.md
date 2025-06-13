## Integración con Frontend: Envío de Actas usando Gmail OAuth 2.0

### ¿Cómo funciona?
Esta API permite que **cualquier usuario** envíe actas desde su propio correo de Gmail/Google Workspace usando autenticación OAuth 2.0. El frontend debe encargarse de obtener el `access_token` del usuario y enviarlo junto con los datos del acta al backend.

### 1. Configuración en Google Cloud
- Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
- Habilita la **API de Gmail**.
- Configura una credencial OAuth 2.0 (tipo "ID de cliente de OAuth").
- Agrega el dominio de tu frontend en los orígenes autorizados.
- Descarga el `client_id` y `client_secret` para usarlos en el frontend.

### 2. Flujo en el Frontend
1. **Solicita autenticación Google OAuth 2.0**
   - Usa la librería oficial de Google (ej: [Google Identity Services](https://developers.google.com/identity/oauth2/web/guides/use-token-model))
   - Solicita el scope: `https://mail.google.com/`
2. **Obtén el `access_token`** del usuario autenticado.
3. **Solicita el correo del usuario** (usualmente viene en el perfil de Google).
4. **Envía el payload a la API** `/send-acta`:

#### Ejemplo de obtención de token (JavaScript)
```js
// Usando Google Identity Services
const client = google.accounts.oauth2.initTokenClient({
  client_id: 'TU_CLIENT_ID.apps.googleusercontent.com',
  scope: 'https://mail.google.com/',
  callback: (response) => {
    // response.access_token es el token que necesitas
    // response.id_token puede usarse para obtener el email
  },
});
client.requestAccessToken();
```

#### Ejemplo de payload para la API
```json
{
  "recipients": ["destinatario@ejemplo.com"],
  "subject": "Acta de la reunión semanal",
  "date": "2025-06-04",
  "next_meeting": "2025-06-11",
  "participants": ["Juan Pérez", "Ana Gómez"],
  "topics": [
    {"title": "Avances", "description": "Se revisaron los hitos cumplidos."}
  ],
  "sender": "usuario.autenticado@gmail.com",
  "access_token": "ya29.a0AfH6S..."
}
```

#### Ejemplo de llamada desde el frontend (fetch)
```js
fetch('http://localhost:8001/send-acta', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### 3. Consideraciones de seguridad y UX
- **Nunca guardes el access_token en localStorage.** Usa memoria o cookies seguras.
- El token debe tener el scope `https://mail.google.com/`.
- El campo `sender` debe coincidir con el usuario autenticado.
- El backend nunca almacena ni solicita contraseñas.
- Si el token expira, el frontend debe refrescarlo automáticamente.

### 4. Recursos útiles
- [Documentación Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Ejemplo de envío SMTP con XOAUTH2](https://developers.google.com/gmail/imap/xoauth2-protocol)
- [Google Identity Services](https://developers.google.com/identity/oauth2/web/guides/use-token-model)

---

---
El código del frontend React se encuentra en la carpeta `frontend`.
