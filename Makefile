.PHONY: mock

DB_CONTAINER_NAME=styrit-secretary-manager-secretary-db-1
GAMMA_DB_CONTAINER_NAME=styrit-secretary-manager-gamma-db-1

mock: secretary_manager_backup.sql
	docker exec -i $(DB_CONTAINER_NAME) psql -U secretary secretary < secretary_manager_backup.sql

migrate:
	cd backend-new && cargo sqlx migrate run && cd ..

clean:
	echo 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;' | docker exec -i $(DB_CONTAINER_NAME) psql -U secretary secretary

reset:
	make clean
	make mock
	make migrate

setup_gamma:
	docker exec -i $(GAMMA_DB_CONTAINER_NAME) psql -U user postgres < gamma_setup.sql
