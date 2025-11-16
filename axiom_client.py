import axiom_py
import os

# Configura las variables de entorno (o cámbialas directamente)
AXIOM_TOKEN = os.getenv("AXIOM_TOKEN", "xaat-0ff601d3-c2e6-4ab8-9d5a-82309064af80")
AXIOM_DATASET = os.getenv("AXIOM_DATASET", "fastapi_vise")

# Crear el cliente de Axiom
client = axiom_py.Client(token=AXIOM_TOKEN)

def send_log(event: dict):
    """Envía un evento individual al dataset de Axiom."""
    try:
        client.ingest_events(
            dataset=AXIOM_DATASET,
            events=[event]
        )
        print(" Evento enviado a Axiom:", event)
    except Exception as e:
        print(" Error al enviar a Axiom:", e)
