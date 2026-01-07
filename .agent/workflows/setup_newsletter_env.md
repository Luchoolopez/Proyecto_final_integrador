---
description: Configurar variables de entorno en Render y Vercel para que el newsletter funcione en producción
---

# Paso 1 – Preparar la contraseña de aplicación de Gmail
1. Accede a https://myaccount.google.com/security
2. Activa la verificación en dos pasos (2FA) si aún no lo está.
3. En *App passwords* crea una nueva contraseña:
   - Aplicación: **Mail**
   - Dispositivo: **Other (Custom name)** → escribe `Render Newsletter`
4. Copia la cadena de 16 caracteres que Google genera. **Esta será `EMAIL_PASS`.**

# Paso 2 – Configurar Render (backend)
1. Abre tu proyecto en Render → *Environment* → **Add Environment Variable**.
2. Añade:
   - `CORS_ORIGIN` → `https://<tu‑frontend>.vercel.app`
   - `EMAIL_USER` → `tuemail@gmail.com`
   - `EMAIL_PASS` → *la cadena de 16 caracteres* del paso 1.
3. Guarda los cambios y pulsa **Trigger Deploy** (o espera al despliegue automático).

# Paso 3 – Verificar logs en Render
1. Ve a la pestaña *Logs* del servicio.
2. Busca las líneas:
```
🔧 EMAIL_USER set: true
🔧 EMAIL_PASS set: true
```
   Si aparecen, la configuración está cargada correctamente.

# Paso 4 – Configurar Vercel (frontend)
1. En Vercel → tu proyecto → **Settings** → **Environment Variables**.
2. Añade la variable:
   - `VITE_API_URL` → `https://<tu‑backend>.onrender.com/api`
   - Marca **Production** (y opcionalmente **Preview**).
3. Guarda y pulsa **Redeploy**.

# Paso 5 – Comprobar que el frontend usa la URL correcta
1. Abre la página de administración del newsletter en el navegador.
2. Abre la consola (`F12`) y ejecuta:
```js
console.log(import.meta.env.VITE_API_URL);
```
3. Debería imprimirse la URL que configuraste en el paso 4.

# Paso 6 – Probar el envío del newsletter
1. Crea un newsletter con asunto ≥ 5 caracteres y contenido ≥ 10 caracteres.
2. Haz clic en **Enviar**.
3. En los logs de Render verifica que aparece:
```
✅ Newsletter enviado a X suscriptores
```
   y que **no** hay `ETIMEDOUT`.

# Paso 7 – Solución de problemas (si algo falla)
- **CORS sigue bloqueando** → Revisa que `CORS_ORIGIN` coincida exactamente con la URL del frontend (incluye `https://` y el sub‑dominio).
- **`ETIMEDOUT` persiste** → En la cuenta de Google revisa *Security → Recent security events* y permite el acceso a la app. Asegúrate de usar la contraseña de aplicación, no la contraseña normal.
- **Frontend sigue llamando a `localhost`** → Verifica que `VITE_API_URL` está marcada como **Production** y que el proyecto se redeployó.
- **`Authentication failed`** → Regenera la contraseña de aplicación y vuelve a actualizar `EMAIL_PASS` en Render.

---

*Este workflow está pensado para ser ejecutado una sola vez, pero puedes volver a usarlo si necesitas volver a configurar las variables o redeployar después de cambios.*
