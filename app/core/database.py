
from typing import Dict
from ..models.cliente import ClientRequest


class DatabaseManager:
    def __init__(self):
        self._clients: Dict[int, dict] = {}
        self._next_id = 1

    def register_client(self, client_data: ClientRequest) -> dict:
        client_dict = client_data.model_dump()
        client_dict["clientId"] = self._next_id
        self._clients[self._next_id] = client_dict
        self._next_id += 1
        return client_dict

    def get_client(self, client_id: int) -> dict | None:
        return self._clients.get(client_id)

    def list_clients(self) -> list:
        return list(self._clients.values())

    def update_client(self, client_id: int, client_data: ClientRequest) -> dict | None:
        if client_id in self._clients:
            updated = client_data.model_dump()
            updated["clientId"] = client_id
            self._clients[client_id] = updated
            return updated
        return None

    def delete_client(self, client_id: int) -> bool:
        return self._clients.pop(client_id, None) is not None

db = DatabaseManager()