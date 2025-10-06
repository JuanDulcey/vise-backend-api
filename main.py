from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import clientes

app = FastAPI(
    title="API Clientes",
    description="API para manejo de clientes",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=443, reload=True)