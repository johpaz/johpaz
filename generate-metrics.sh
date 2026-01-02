#!/bin/bash

# Script para generar métricas de GitHub localmente usando Docker
# Asegúrate de tener Docker instalado y ejecutándose.
# Uso: export GITHUB_TOKEN=tu_token && ./generate-metrics.sh

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: La variable de entorno GITHUB_TOKEN no está definida."
    echo "Por favor, ejecútala así: export GITHUB_TOKEN=tu_token_aqui && ./generate-metrics.sh"
    exit 1
fi

echo "Generando métricas localmente para el usuario: johpaz..."

docker run --rm \
    -e GITHUB_TOKEN="$GITHUB_TOKEN" \
    -v "$(pwd):/rendered" \
    lowlighter/metrics:latest \
    --user johpaz \
    --template classic \
    --base "header, community, repositories, metadata" \
    --repositories_affiliations "owner, collaborator" \
    --plugin_languages "yes" \
    --plugin_languages_limit 8 \
    --plugin_languages_sections "most-used" \
    --plugin_languages_details "bytes-size, percentage" \
    --plugin_languages_indepth "yes" \
    --plugin_languages_analysis_timeout 30 \
    --plugin_notable "yes" \
    --plugin_notable_from "owner" \
    --plugin_notable_self "yes" \
    --plugin_notable_repositories "yes" \
    --plugin_notable_types "owner" \
    --plugin_achievements "yes" \
    --plugin_achievements_threshold "B" \
    --plugin_achievements_secrets "no" \
    --plugin_achievements_limit 10 \
    --plugin_achievements_display "compact" \
    --plugin_achievements_only "polyglot, stargazer, developer, maintainer, collaborator" \
    --plugin_habits "yes" \
    --plugin_habits_from 150 \
    --plugin_habits_days 14 \
    --plugin_habits_facts "no" \
    --plugin_habits_charts "yes" \
    --plugin_habits_trim "yes" \
    --plugin_isocalendar "yes" \
    --plugin_isocalendar_duration "half-year" \
    --output-action none > github-metrics.svg

echo "¡Listo! El archivo github-metrics.svg ha sido generado en el directorio actual."
