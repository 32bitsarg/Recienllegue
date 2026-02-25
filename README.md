<p align="center">
  <img src="public/assets/icons/Iconrmbg.png" width="120" height="120" alt="Recién Llegué Logo" />
</p>

<h1 align="center">Recién Llegué</h1>

<p align="center">
  <strong>La guía de supervivencia definitiva para el estudiante en Pergamino.</strong>
</p>

<p align="center">
  <a href="#-tech-stack">Stack Tecnológico</a> •
  <a href="#-características">Características</a> •
  <a href="#-comenzando">Comenzando</a> •
  <a href="#-arquitectura">Arquitectura</a> •
  <a href="#-despliegue">Despliegue</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

---

## 🌟 Descripción

**Recién Llegué** no es solo una app, es el compañero indispensable para cualquiera que llegue a Pergamino, especialmente estudiantes de la **UNNOBA**. Centraliza todo lo que necesitas saber para moverte, comer, cuidarte y vivir en la ciudad sin morir en el intento.

---

## 🚀 Características

### 🚍 Movilidad Urbana
*   **Líneas de Colectivo (A, B, C, D, E)**: Visualización de recorridos completos sobre el mapa.
*   **KML Integration**: Rutas precisas cargadas desde archivos geográficos.

### 🏥 Salud y Bienestar
*   **Farmacias de Turno**: Información actualizada para emergencias.
*   **Centros de Salud**: Mapa con hospitales y clínicas cercanas.

### 🍕 Guía Gastronómica
*   **Locales de Comida**: Listado curado con cálculo de distancia real (en metros y tiempo de caminata) desde las sedes de la UNNOBA.
*   **Categorización**: Filtros por tipo de comida y valoraciones.

### 🏠 Vivienda y Comunidad
*   **Hospedajes**: Buscador de pensiones y departamentos.
*   **Avisos Clasificados**: Espacio para compra/venta y servicios comunitarios.
*   **Agenda Cultural**: Eventos de la ciudad sincronizados.

---

## 🛠️ Tech Stack

| Componente | Tecnología |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Frontend** | React 19, Framer Motion, CSS Modules |
| **Base de Datos** | PostgreSQL (Prisma ORM) |
| **Mapas** | Leaflet & React Leaflet |
| **Autenticación** | NextAuth.js |
| **Almacenamiento** | Appwrite Storage (Imágenes) |
| **UI Icons** | Lucide React |

---

## 📁 Arquitectura del Proyecto

```text
├── src/
│   ├── app/                # Rutas y Server Actions (Lógica de servidor)
│   │   ├── actions/        # Server Actions divididos por dominio (data, auth)
│   │   ├── admin/          # Panel de administración
│   │   ├── api/            # Endpoints de API (Upload, etc.)
│   │   └── (routes)/       # Páginas públicas (mapa, transporte, avisos...)
│   ├── components/         # Componentes de UI
│   │   ├── desktop/        # Vistas optimizadas para Escritorio
│   │   ├── mobile/         # Vistas optimizadas para Móvil (PWA focus)
│   │   ├── layout/         # Navegación, Sidebars, Transiciones
│   │   └── common/         # Componentes compartidos (Logo, Loading, etc.)
│   ├── lib/                # Configuración de Prisma y Auth
│   └── hooks/              # Custom hooks (scroll, drag, etc.)
├── public/
│   ├── assets/             # KMLs, Iconos y JSONs de datos estáticos
│   └── manifest.json       # Configuración PWA
├── prisma/                 # Esquema de DB y Seeds
└── scripts/                # Herramientas de mantenimiento y scrapers
```

---

## ⚙️ Comenzando

### Requisitos previos
*   **Node.js** v20 o superior.
*   **PostgreSQL** (o una base de datos compatible con Prisma).

### Instalación Local

1.  **Clonar y entrar**:
    ```bash
    git clone https://github.com/tu-usuario/recien-llegue.git
    cd recien-llegue
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Entorno**:
    Crea un `.env` con:
    ```env
    DATABASE_URL="postgresql://..."
    NEXTAUTH_SECRET="tu_secreto"
    APPWRITE_API_KEY="..."
    ```

4.  **Base de Datos**:
    ```bash
    npx prisma db push
    ```

5.  **Ejecutar**:
    ```bash
    npm run dev
    ```

---

## � PWA Ready
Este proyecto usa `@ducanh2912/next-pwa` para ofrecer una experiencia offline y de instalación nativa. Ideal para consultar el mapa o las líneas de colectivo mientras caminas por la ciudad.

---

<p align="center">
  Hecho con 💪 para los estudiantes de Pergamino.
</p>
