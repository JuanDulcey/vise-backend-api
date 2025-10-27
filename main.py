from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import clientes

# OpenTelemetry setup
import otel_setup
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor


# Configura Azure Monitor directamente con el string de conexión
configure_azure_monitor(
    connection_string="InstrumentationKey=235ce92f-07ea-41f2-8015-bed44710efa7;IngestionEndpoint=https://mexicocentral-0.in.applicationinsights.azure.com/;LiveEndpoint=https://mexicocentral.livediagnostics.monitor.azure.com/;ApplicationId=d47e9fa7-a0c0-473c-a61f-b2fa8ca7bd89"
)

app = FastAPI(
    title="API Clientes",
    description="API para manejo de clientes",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Instrumentación de FastAPI y solicitudes HTTP
FastAPIInstrumentor.instrument_app(app)
RequestsInstrumentor().instrument()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Rutas
app.include_router(clientes.router)


@app.get("/")
async def root():
    return {"message": "Hello from FastAPI with App Insights!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
