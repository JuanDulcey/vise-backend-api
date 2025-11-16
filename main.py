# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# Routers
from app.routers import clientes

# Logs Axiom (los mismos que ya tienes)
from axiom_logger import setup_logger

# OpenTelemetry
from exporter import tracer  # activa el OTLP exporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.instrumentation.urllib import URLLibInstrumentor

# ============================================
# 🚀 CONFIG FASTAPI
# ============================================

app = FastAPI(
    title="API Clientes",
    description="API con telemetría completa OTLP + Axiom",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# 🧩 Inicializar Logger Axiom
# ============================================

client, logger = setup_logger()

# ============================================
# 🎯 INSTRUMENTACIÓN COMPLETA
# ============================================

# Spans para cada request FastAPI
FastAPIInstrumentor.instrument_app(app)

# Correlación automática log ↔ trace
LoggingInstrumentor().instrument(set_logging_format=True)

# Instrumentación para peticiones HTTP salientes
RequestsInstrumentor().instrument()
URLLibInstrumentor().instrument()

# ============================================
# 📦 Middleware adicional sólo para logs extra
# (NO genera spans, solo metadata)
# ============================================

@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    logger.info(
        "Petición procesada",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
        },
    )
    return response

# ============================================
# 🧩 RUTAS
# ============================================

app.include_router(clientes.router)

@app.get("/")
async def root():
    logger.info("Ruta / llamada", extra={"path": "/"})
    return {"message": "Hello with FULL telemetry!"}

# ============================================
# ▶️ EJECUCIÓN LOCAL
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
