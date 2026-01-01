#!/bin/bash
# Start development container with hot-reload

cd "$(dirname "$0")/.." || exit 1
docker-compose -f docker/docker-compose.yml up -d dev

echo "Development server starting on http://localhost:7914"
echo "Changes to frontend/ will be reflected automatically"

