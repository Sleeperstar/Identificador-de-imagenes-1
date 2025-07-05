# Aplicación de Reconocimiento de Animales con Gemini y Next.js

Esta es una aplicación web para reconocer animales en imágenes utilizando la API de Google Gemini.

## Cómo empezar

### 1. Prerrequisitos

- Node.js (versión 18.x o superior)
- npm, yarn, o pnpm

### 2. Obtener una API Key

Necesitas una API Key de Google AI Studio para usar el modelo Gemini.

1.  Ve a [Google AI Studio](https://aistudio.google.com/).
2.  Inicia sesión con tu cuenta de Google.
3.  Crea un nuevo proyecto o usa uno existente.
4.  Haz clic en "Get API key" para generar tu clave.

### 3. Configuración del Proyecto

1.  Clona este repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO>
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Crea un archivo de entorno local. Copia `.env.example` a `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
    Si no tienes `.env.example`, crea un archivo llamado `.env.local` en la raíz del proyecto.

4.  Añade tu API Key al archivo `.env.local`:
    ```
    GOOGLE_API_KEY="TU_API_KEY_AQUI"
    ```

### 4. Ejecutar la Aplicación

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### 5. Despliegue en Vercel

1.  Sube tu proyecto a un repositorio de GitHub.
2.  Ve a [Vercel](https://vercel.com/) y regístrate.
3.  Importa tu repositorio de GitHub.
4.  Vercel detectará que es un proyecto de Next.js y configurará el build automáticamente.
5.  **Importante**: Ve a la configuración del proyecto en Vercel, busca la sección "Environment Variables" y añade tu `GOOGLE_API_KEY` con el mismo valor que tienes en tu archivo `.env.local`.
6.  Despliega la aplicación.
