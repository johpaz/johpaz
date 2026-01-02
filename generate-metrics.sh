#!/bin/bash

# Script para generar GitHub Metrics localmente usando Docker
# Asegúrate de tener un archivo .env con tu GITHUB_TOKEN o pásalo como variable de entorno.

if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: La variable de entorno GITHUB_TOKEN no está definida."
    echo "Crea un archivo .env con GITHUB_TOKEN=tu_token o ejecútalo como: GITHUB_TOKEN=... ./generate-metrics.sh"
    exit 1
fi

echo "Generando métricas localmente para el usuario: johpaz..."

docker run --rm \
    -e GITHUB_TOKEN=$GITHUB_TOKEN \
    -v "$(pwd):/rendered" \
    lowlighter/metrics:latest \
    --user johpaz \
    --template classic \
    --base "header, community, repositories, metadata" \
    --plugin_languages "yes" \
    --plugin_languages_limit 10 \
    --plugin_languages_sections "most-used" \
    --plugin_languages_details "bytes-size, percentage" \
    --plugin_notable "yes" \
    --plugin_notable_from "owner, self" \
    --plugin_notable_self "yes" \
    --plugin_notable_repositories "yes" \
    --plugin_notable_types "owner" \
    --plugin_achievements "yes" \
    --plugin_achievements_threshold "B" \
    --plugin_achievements_secrets "no" \
    --plugin_achievements_limit 10 \
    --plugin_habits "yes" \
    --plugin_habits_from 100 \
    --plugin_habits_days 14 \
    --plugin_habits_facts "yes" \
    --plugin_habits_charts "yes" \
    --plugin_habits_trim "yes" \
    --plugin_isocalendar "yes" \
    --plugin_isocalendar_duration "half-year" \
    --config_timezone "America/Bogota" \
    --output-action "none"

echo "¡Listo! La imagen debería haberse generado en la carpeta actual."
