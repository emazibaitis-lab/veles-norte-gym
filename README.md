# VELES NORTE GYM

Aplicación web para socios de VELES NORTE GYM. Permite iniciar sesión, explorar ejercicios por grupo muscular, consultar rutinas semanales, registrar ejercicios completados y seguir desafíos personales.

## Funcionalidades

- Inicio de sesión con correo y contraseña mediante Firebase Authentication.
- Validación del perfil del socio en `socios/{uid}` de Cloud Firestore.
- Tres rutinas semanales con seguimiento individual del progreso por ejercicio.
- Mapa corporal interactivo con vistas frontal y posterior, conectado a un catálogo general de ejercicios.
- Fichas ampliadas de ejercicios.
- Desafíos personales: inscripción, registro de avances y eliminación.
- Diseño responsive para computadoras y celulares.

Las rutinas y el catálogo general son datos estáticos del proyecto. El progreso de rutinas y la participación en desafíos se guardan por socio en Firestore.

## Tecnologías

- React y Vite
- Firebase Authentication
- Cloud Firestore
- JavaScript y CSS
- ExerciseDB para cargar detalles y animaciones disponibles de ejercicios. La disponibilidad de esos recursos depende del servicio externo.

## Recursos visuales externos

Los GIF de demostración se sirven desde ExerciseDB. Al depender de un servicio externo, algún GIF puede tardar en cargar o dejar de estar disponible. Si eso ocurre, la ficha del ejercicio sigue mostrando la información y las indicaciones locales; solo puede faltar la animación.

## Requisitos

- Node.js y npm compatibles con la versión de Vite del proyecto.
- Un proyecto de Firebase con Authentication y Cloud Firestore habilitados.
- Un perfil de socio en Firestore para cada cuenta que vaya a iniciar sesión.

## Ejecutar localmente

1. Cloná el repositorio y abrí una terminal en la carpeta del proyecto.
2. Instalá las dependencias:

   ```bash
   npm install
   ```

3. Creá un archivo `.env` en la raíz del proyecto. Podés copiar `.env.example` y completar los valores de configuración de Firebase.
4. Iniciá el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrí en el navegador la dirección local que muestra Vite en la terminal.

## Configuración de Firebase

Copiá `.env.example` como `.env` y completá los valores en Firebase Console. Las variables que comienzan con `VITE_` se incorporan al cliente web; no pongas contraseñas, claves privadas ni credenciales de cuentas de servicio en ellas.

En Firebase Console:

1. Habilitá el proveedor de correo y contraseña en **Authentication**.
2. Creá o habilitá la base de datos de **Cloud Firestore**.
3. Para cada socio, creá `socios/{uid}`, usando como ID el UID de Firebase Authentication. El perfil debe incluir `nombre`, `email`, `rol` y `activo`; el inicio de sesión requiere `activo: true`.
4. Configurá reglas de Firestore para que un usuario autenticado solo pueda acceder a sus propios documentos y subcolecciones. La aplicación usa estas rutas:

   ```text
   socios/{uid}
   socios/{uid}/progresoRutinas/{rutinaId}
   socios/{uid}/desafios/{desafioId}
   ```

   Permití solo las operaciones y campos necesarios para cada ruta. En particular, el socio no debe poder modificar su perfil, rol ni datos de otros usuarios. No uses reglas abiertas a cualquier lectura o escritura. Las reglas se configuran y publican desde **Firestore Database → Reglas** en Firebase Console; este repositorio no las publica automáticamente.

## Comandos disponibles

```bash
npm run dev      # servidor local de desarrollo
npm run lint     # revisión estática del código
npm run build    # compilación de producción
npm run preview  # vista local de la compilación
```

## Publicar en GitHub y Vercel

1. Subí el código fuente a un repositorio de GitHub. No subas `.env`; está excluido por `.gitignore`.
2. En Vercel, importá ese repositorio y desplegá la aplicación como proyecto Vite. El comando de compilación es `npm run build` y la carpeta de salida es `dist`.
3. En la configuración del proyecto de Vercel, agregá las mismas variables `VITE_FIREBASE_*` que usa el `.env` local, para los entornos donde quieras publicar.
4. Volvé a desplegar después de agregar o cambiar variables de entorno.
5. Configurá en Firebase Authentication los dominios autorizados que correspondan, incluyendo el dominio de producción de Vercel.
6. Abrí la URL publicada y comprobá el inicio de sesión, la lectura del perfil, el progreso de las rutinas y el ciclo de desafíos.

**URL de producción:** agregar aquí la URL asignada por Vercel.

## Estructura principal

```text
src/
├── components/   # navegación, footer, mapa corporal, login y desafíos
├── data/         # rutinas, consejos, catálogo y contenido estático
├── services/     # acceso a Firebase y resolución de recursos externos
├── pages/        # vistas de inicio, rutina y detalle de ejercicio
├── App.jsx       # sesión, estado compartido y coordinación de vistas
├── firebase.js   # inicialización de Authentication y Firestore
├── App.css
└── index.css
```
