# exporter.py
import os
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

AXIOM_DATASET = os.getenv("AXIOM_DATASET", "fastapi_vise")
AXIOM_TOKEN = os.getenv("AXIOM_TOKEN")
AXIOM_URL = "https://api.axiom.co/v1/traces"

otlp_exporter = OTLPSpanExporter(
    endpoint=AXIOM_URL,
    headers={
        "Authorization": f"Bearer {AXIOM_TOKEN}",
        "X-Axiom-Dataset": AXIOM_DATASET,
    },
)

# MUY IMPORTANTE → Identidad del servicio
provider = TracerProvider(
    resource=Resource.create({"service.name": "fastapi_vise"})
)

provider.add_span_processor(BatchSpanProcessor(otlp_exporter))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("fastapi_vise")
