#!/bin/bash
# Start production container

cd "$(dirname "$0")/.." || exit 1
docker-compose -f docker/docker-compose.yml up -d production

echo "Production server starting on http://localhost:7904"


