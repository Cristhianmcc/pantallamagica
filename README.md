# 🎬 CineStream - Plataforma de Streaming de Películas

Una moderna plataforma de streaming de películas desarrollada con Next.js, diseñada para consumir contenido desde Terabox y ofrecer una experiencia visual similar a Netflix.

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz estilo Netflix con gradientes y animaciones atractivas
- 📱 **Responsive Design**: Optimizado para desktop, tablet y móvil
- 🔍 **Búsqueda Avanzada**: Filtros por género y búsqueda en tiempo real
- ▶️ **Reproductor Integrado**: Player de video HTML5 con controles completos
- 🎯 **Navegación Intuitiva**: Hero section dinámico y grid de películas interactivo
- 📡 **API de Terabox**: Integración preparada para conectar con Terabox API

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15 con JavaScript (NO TypeScript)
- **Estilos**: CSS Modules personalizados (NO Tailwind)
- **Backend**: API Routes de Next.js
- **Integración**: Terabox API (preparado para configurar)
- **Optimización**: Next.js Image optimization
- **Responsive**: CSS Grid y Flexbox

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone <tu-repositorio>
   cd peliculas
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   # Terabox API Configuration
   TERABOX_API_KEY=tu_api_key_de_terabox
   TERABOX_ACCESS_TOKEN=tu_access_token
   TERABOX_REFRESH_TOKEN=tu_refresh_token
   
   # Next.js Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**:
   Visita [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── movies/         # API para obtener películas
│   │   ├── stream/         # API para streaming de video
│   │   └── placeholder/    # API para imágenes placeholder
│   ├── movie/
│   │   └── [id]/          # Página individual de película
│   ├── globals.css        # Estilos globales
│   ├── layout.js          # Layout principal
│   ├── page.js            # Página principal
│   └── page.module.css    # Estilos de página principal
├── components/
│   ├── Header.js          # Barra de navegación
│   ├── Hero.js            # Sección principal con carousel
│   ├── MovieGrid.js       # Grid de películas
│   ├── Footer.js          # Pie de página
│   └── *.module.css       # Estilos de componentes
```

## 🔧 Integración con Terabox

El proyecto está preparado para integrarse con la API de Terabox. Para configurar:

1. **Obtener credenciales de Terabox API**
2. **Configurar las variables de entorno**
3. **Actualizar las APIs en `/src/app/api/`**

### Ejemplo de integración:

```javascript
// En /src/app/api/movies/route.js
const teraboxResponse = await fetch('https://api.terabox.com/movies', {
  headers: {
    'Authorization': `Bearer ${process.env.TERABOX_API_KEY}`,
    'Content-Type': 'application/json'
  }
});
```

## 📱 Funcionalidades Principales

### 🏠 Página Principal
- Hero section con carousel automático
- Grid responsive de películas
- Búsqueda en tiempo real
- Filtros por género
- Navegación fluida

### 🎬 Página de Película
- Información detallada de la película
- Reproductor de video integrado
- Metadatos (año, género, calificación, duración)
- Botones de acción (reproducir, agregar a lista, descargar)

### 🔍 Búsqueda y Filtros
- Búsqueda instantánea por título
- Filtros por género
- Resultados en tiempo real

## 🎨 Diseño y UI/UX

- **Paleta de colores**: Esquema oscuro con acentos rojos (#e50914)
- **Tipografía**: Fuentes del sistema optimizadas
- **Animaciones**: Transiciones suaves y efectos hover
- **Gradientes**: Fondos dinámicos y atractivos
- **Responsive**: Adaptable a todos los tamaños de pantalla

## 🔮 Próximas Funcionalidades

- [ ] Sistema de autenticación de usuarios
- [ ] Lista personal de películas favoritas
- [ ] Recomendaciones personalizadas
- [ ] Comentarios y calificaciones
- [ ] Subtítulos multi-idioma
- [ ] Modo offline / descarga
- [ ] Historial de visualización

## 📝 Scripts Disponibles

```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en producción
npm run lint         # Ejecutar ESLint
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre** - [Tu GitHub](https://github.com/tu-usuario)

---

⭐️ Si te gusta este proyecto, ¡dale una estrella!

## 🔗 Links Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Terabox API Documentation](https://terabox.com/api-docs)
- [CSS Modules](https://github.com/css-modules/css-modules)
