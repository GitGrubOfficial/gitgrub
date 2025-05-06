# Makefile for managing Docker + Django dev tools

# Default container name
BACKEND_CONTAINER=backend

.PHONY: lint format shell restart

# Run ruff and isort
lint:
	docker compose exec $(BACKEND_CONTAINER) sh -c "ruff ."

format:
	docker compose exec $(BACKEND_CONTAINER) sh -c 'isort . && ruff check . --fix'

shell:
	docker compose exec $(BACKEND_CONTAINER) sh

restart:
	docker compose restart $(BACKEND_CONTAINER)
migrate:
	docker compose exec $(BACKEND_CONTAINER) sh -c "python manage.py migrate"

makemigrations:
	docker compose exec $(BACKEND_CONTAINER) sh -c "python manage.py makemigrations"