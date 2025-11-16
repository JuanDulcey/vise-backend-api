# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging

# Routers
try:
    from app.routers import clientes
except ImportError:
    try:
        from routers import clientes
    except ImportError:
        logging.warning("No se pudo importar el router de clientes")

# Logs Axiom
try:
    from axiom_logger import setup_logger
except ImportError as e:
    logging.error(f"Error importing axiom_logger: {e}")
    # Fallback a logger básico
    client = None
    logger = logging.getLogger(__name__)

# OpenTelemetry con manejo de errores
try:
    # Si tienes un módulo exporter personalizado
    from exporter import tracer
except ImportError:
    # Fallback: usar tracer estándar
    from opentelemetry import trace
    tracer = trace.get_tracer(__name__)

try:
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    from opentelemetry.instrumentation.requests import RequestsInstrumentor
    from opentelemetry.instrumentation.urllib import URLLibInstrumentor
    
    # ✅ LoggingInstrumentor NO EXISTE - eliminado
    HAS_OPENTELEMETRY = True
except ImportError as e:
    HAS_OPENTELEMETRY = False
    logging.warning(f"OpenTelemetry no disponible: {e}")

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

try:
    client, logger = setup_logger()
except Exception as e:
    logging.error(f"Error setting up Axiom logger: {e}")
    # Fallback a logger estándar
    import logging
    logger = logging.getLogger(__name__)
    client = None

# ============================================
# 🎯 INSTRUMENTACIÓN COMPLETA
# ============================================

if HAS_OPENTELEMETRY:
    try:
        # Spans para cada request FastAPI
        FastAPIInstrumentor.instrument_app(app)
        
        # ✅ LoggingInstrumentor ELIMINADO - no existe
        # En su lugar, configurar logging básico
        logging.basicConfig(level=logging.INFO)
        
        # Instrumentación para peticiones HTTP salientes
        RequestsInstrumentor().instrument()
        URLLibInstrumentor().instrument()
        
        logger.info("✅ OpenTelemetry instrumentation enabled")
        
    except Exception as e:
        logger.error(f"❌ Error en instrumentación OpenTelemetry: {e}")
        HAS_OPENTELEMETRY = False
else:
    logger.warning("⚠️ OpenTelemetry instrumentation disabled")

# ============================================
# 📦 Middleware adicional para logs
# ============================================

@app.middleware("http")
async def log_requests(request: Request, call_next):
    try:
        # Usar el tracer de OpenTelemetry si está disponible
        if HAS_OPENTELEMETRY:
            with tracer.start_as_current_span("http_request") as span:
                span.set_attribute("http.method", request.method)
                span.set_attribute("http.url", str(request.url))
                
                response = await call_next(request)
                
                span.set_attribute("http.status_code", response.status_code)
        else:
            response = await call_next(request)
        
        # Log con Axiom
        logger.info(
            "Petición procesada",
            extra={
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "query_params": str(request.query_params),
            },
        )
        return response
    except Exception as e:
        logger.error(f"Error en middleware: {e}")
        raise

# ============================================
# 🧩 RUTAS
# ============================================

@app.get("/health")
async def health():
    return {"status": "ok", "service": "API Clientes", "otel": HAS_OPENTELEMETRY}

# Incluir routers solo si están disponibles
if 'clientes' in locals() or 'clientes' in globals():
    app.include_router(clientes.router)
else:
    logger.warning("Router de clientes no disponible")

@app.get("/")
async def root():
    logger.info("Ruta raíz accedida", extra={"path": "/"})
    return {
        "message": "Hello with FULL telemetry!", 
        "service": "API Clientes",
        "otel_enabled": HAS_OPENTELEMETRY
    }

# ============================================
# ▶️ EJECUCIÓN LOCAL
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
