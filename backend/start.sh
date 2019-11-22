#!/usr/bin/env sh

wait_for_postgres() (
    first_iteration=true
    while ! pg_isready -h "$SECRETARY_POSTGRES_HOST" -p "$SECRETARY_POSTGRES_PORT" -q; do
        if [ -n "$first_iteration" ]; then
            printf "Waiting for db \"postgresql://%s@%s:%s\"" "$SECRETARY_POSTGRES_USER" "$SECRETARY_POSTGRES_HOST" "$SECRETARY_POSTGRES_PORT"
            unset first_iteration
        else
            printf "."
        fi

        sleep 1
    done
    if [ -z "$first_iteration" ]; then echo; fi
)

wait_for_postgres
python -u src/app.py
