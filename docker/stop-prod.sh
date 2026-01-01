#!/bin/bash
# Stop production container

cd "$(dirname "$0")/.." || exit 1
docker-compose -f docker/docker-compose.yml stop production

echo "Production server stopped"

