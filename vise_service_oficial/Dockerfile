# Dockerfile para el Frontend de Vise
# Imagen base de Node.js
FROM node:18-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json yarn.lock* ./

# Instalar dependencias con Yarn
RUN yarn install --frozen-lockfile

# Copiar código fuente (excluyendo node_modules)
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.js ./

# Construir la aplicación para producción
RUN yarn build

# Etapa de producción con Nginx
FROM nginx:alpine AS production

# Copiar los archivos construidos al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
