# axiom_logger.py
import axiom_py
from axiom_py.logging import AxiomHandler
import logging
import os

def setup_logger():
    dataset = os.getenv("AXIOM_DATASET", "fastapi_vise")
    token = os.getenv("AXIOM_TOKEN")

    if not token:
        raise ValueError(" AXIOM_TOKEN no está definido. Usa 'export AXIOM_TOKEN=<tu_token>' antes de ejecutar el servidor.")

    # Cliente de Axiom
    client = axiom_py.Client(token)

    # Handler para enviar logs
    handler = AxiomHandler(client, dataset)
    handler.setLevel(logging.INFO)

    # Logger general
    logger = logging.getLogger("fastapi_vise")
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)

    logger.info(" Logger conectado a Axiom correctamente.")
    return client, logger
