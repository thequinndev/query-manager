FROM postgres:latest

ENV POSTGRES_USER="query-manager-user"
ENV POSTGRES_PASSWORD="query-manager-password"
ENV POSTGRES_DB="query-manager-db"

COPY init.dev.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
