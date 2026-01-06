# 🛍️ Proyecto Final Integrador - e-commerce Tienda de Ropa

## 👥 Equipo
- Agustin Barbero
- Felipe Fernandez
- Luciano Nicolas Lopez Gonzalez
  

---


Este proyecto consiste en el desarrollo de una aplicación web completa (Full Stack) para un e-commerce dedicado a la venta de ropa, incorporando funcionalidades de gestión de usuarios, catálogo de productos, carrito de compras, pagos y panel de administración.

## 🚀 Deploy

La aplicación se encuentra desplegada y operativa en las siguientes plataformas:

- **Frontend:** [Vercel](https://proyecto-final-integrador.vercel.app)
- **Backend:** Render
- **Base de Datos:** Aiven (MySQL en la nube)

---

## ✨ Características

### Para Usuarios
- Catálogo de productos con filtros y búsqueda
- Carrito de compras interactivo
- Registro e inicio de sesión de usuarios
- Proceso de checkout simplificado
- Diseño responsive y adaptable

### Para Administradores
- Panel administrativo completo
- Agregar, editar, eliminar productos y categorias
- Gestión de inventario
- Administración de usuarios
- Visualización de órdenes y ventas
---

## 📋 Gestión del Proyecto

Para la organización de tareas y seguimiento del desarrollo ágil, utilizamos **Trello**:
🔗 [Tablero del Proyecto en Trello](https://trello.com/b/hEHrkm3s/proyecto-final-prog-iv)

---

## 🛠️ Tecnologías Utilizadas

El proyecto fue construido utilizando una arquitectura moderna y escalable, dividida en Frontend y Backend.

### 🎨 Frontend
El cliente web fue desarrollado con **React** y **Vite** para una experiencia de usuario rápida y reactiva.

* **Estilos y UI:** Bootstrap (v5), React Bootstrap
* **Enrutamiento:** React Router DOM
* **Consumo de API:** Axios

### 🔧 Backend
El servidor es una API RESTful robusta construida sobre **Node.js**.

* **Core:** Node.js, Express
* **Lenguaje:** TypeScript
* **Base de Datos y ORM:** MySQL, Sequelize
* **Autenticación y Seguridad:**
    * JSON Web Tokens (JWT)
    * Bcrypt (Hash de contraseñas)
    * Cors
* **Validación de Datos:** Zod
* **Manejo de Archivos:** Multer, Cloudinary (Almacenamiento de imágenes en la nube)
* **Utilidades:**
    * Nodemailer (Envío de correos electrónicos)
    * PDFKit (Generación de facturas/reportes PDF)
* **Testing:** Jest, Supertest

### 🐳 Infraestructura y DevOps
Para el desarrollo local y la contenerización de servicios.

* **Docker:** Contenerización de la aplicación.
* **Docker Compose:** Orquestación de servicios (Frontend, Backend y Base de datos MySQL local).

---

## 💻 Instalación y Ejecución Local

Si se desea correr este proyecto en un entorno local, se puede hacer fácilmente utilizando Docker.

### Prerrequisitos
* Tener instalado Docker y Docker Compose.
* Git.

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Luchoolopez/Proyecto_final_integrador.git
    cd .\Proyecto_final_integrador\
    ```

2.  **Configurar variables de entorno:**
    Crear los archivos `.env` en las carpetas `backend/` y raíz basándote en los templates proporcionados (`.env.template`).

3.  **Levantar la aplicación con Docker Compose:**
    ```bash
    docker compose up --build
    ```
    Esto levantará los siguientes servicios:
    * **Backend:** Accesible en `http://localhost:3000`
    * **Frontend:** Accesible en `http://localhost:5173`
    * **MySQL:** Base de datos local (Puerto 3307 para evitar conflictos).

---
