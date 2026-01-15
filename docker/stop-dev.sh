#!/bin/bash
# Stop development container

cd "$(dirname "$0")/.." || exit 1
docker-compose -f docker/docker-compose.yml stop dev

echo "Development server stopped"


