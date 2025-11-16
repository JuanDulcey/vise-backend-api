# 🏦 VISE API – Telemetría, Docker, Testing & Deploy Automatizado

Este proyecto implementa una **API de clientes y compras** con **FastAPI**, totalmente instrumentada con **OpenTelemetry**, envío de logs a **Axiom**, contenedorizada con **Docker**, testeada automáticamente con **Hurl**, y desplegada en **Azure App Service** mediante GitHub Actions.

La API expone dos endpoints principales:

- **POST /client** → Crear un cliente.
- **POST /purchase** → Realizar una compra y aplicar beneficios según el tipo de tarjeta.

Además, incluye:

- Observabilidad completa (traces + logs).
- Healthcheck integrado.
- Workflows de CI/CD totalmente automatizados.
- Testing automatizado con Hurl.

---

## 📂 Tecnologías principales

- Python 3.12  
- FastAPI  
- Uvicorn  
- Docker  
- GitHub Actions  
- Hurl (API Testing)  
- Azure App Service  
- OpenTelemetry  
- Axiom Logging  

---


## 1. Clonar el Repositorio

```bash
git clone https://github.com/JuanDulcey/vise-backend-api.git
cd vise-backend-api
```

---

## 2. Instalar Dependencias

Asegúrate de tener Python 3.10 o superior instalado. Luego ejecuta:

```bash
pip install -r requirements.txt
```

---

## 3. Ejecutar la API Localmente

```bash
python -m uvicorn main:app --reload
```

---

## 4. Endpoints Disponibles

- **Documentación Swagger:**  
  http://localhost:8000/docs

- **Healthcheck:**  
  http://localhost:8000/health

- **Ruta Raíz:**  
  http://localhost:8000/

---

## 5. Estructura General del Proyecto

```
vise-backend-api/
│── app/
│   ├── routers/
│   ├── models/
│   └── ...
│── main.py
│── requirements.txt
└── ...
```
