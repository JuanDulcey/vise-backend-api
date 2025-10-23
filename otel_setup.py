from opentelemetry import trace
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.trace import Status, StatusCode
import time
import random

# Configurar atributos del servicio
resource = Resource.create({
    SERVICE_NAME: "viseapi",
    "service.namespace": "devops",
    "deployment.environment": "production"
})

# Configurar proveedor de trazas
provider = TracerProvider(resource=resource)
trace.set_tracer_provider(provider)

# Exportador OTLP para Grafana Cloud
otlp_exporter = OTLPSpanExporter(
    endpoint="https://otlp-gateway-prod-us-east-2.grafana.net/otlp/v1/traces",
    headers={
        "Authorization": "Basic MTQxMTE5NzpnbGNfZXlKdklqb2lNVFUyTlRZeU5DSXNJbTRpT2lKMmFYTmxMV0Z3YVMxdWIyUmxMWFJ2YTJWdUlpd2lheUk2SWpCT1dYQkNNSEJ2TjJzd2VuWmxVRWt4TkRGWk1HRXlNQ0lzSW0waU9uc2ljaUk2SW5CeWIyUXRkWE10WldGemRDMHdJbjE5"
    }
)

# Procesador de spans para enviar a Grafana
otlp_processor = BatchSpanProcessor(otlp_exporter)
provider.add_span_processor(otlp_processor)

# (Opcional) También exportar a consola para debug local
console_exporter = ConsoleSpanExporter()
console_processor = BatchSpanProcessor(console_exporter)
provider.add_span_processor(console_processor)

# Obtener el tracer
tracer = trace.get_tracer(__name__)

# Simular 50 spans de prueba
for i in range(50):
    with tracer.start_as_current_span(f"test-span-{i}") as span:
        span.set_attribute("test.id", i)
        span.set_attribute("test.value", random.randint(100, 999))
        span.set_attribute("http.method", "GET")
        span.set_attribute("http.route", f"/api/test/{i}")
        span.set_attribute("user.region", random.choice(["LATAM", "EU", "ASIA"]))
        if i % 10 == 0:
            span.set_status(Status(StatusCode.ERROR, "Simulated error"))
            span.set_attribute("error", True)
        time.sleep(0.05)  # Simula latencia

print("✅ 50 spans simulados y enviados a Grafana Cloud")
