#!/bin/bash
# Manage production and development containers

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

usage() {
    echo "Usage: $0 {prod|dev} {start|stop|restart|logs|status}"
    echo ""
    echo "Examples:"
    echo "  $0 prod start    - Start production container"
    echo "  $0 dev stop      - Stop development container"
    echo "  $0 prod restart  - Restart production container"
    echo "  $0 dev logs      - Show development container logs"
    echo "  $0 prod status   - Show production container status"
    exit 1
}

if [ $# -lt 2 ]; then
    usage
fi

ENV=$1
ACTION=$2

case "$ENV" in
    prod|production)
        SERVICE="production"
        PORT="7904"
        ;;
    dev|development)
        SERVICE="dev"
        PORT="7914"
        ;;
    *)
        echo "Error: Invalid environment '$ENV'. Use 'prod' or 'dev'"
        usage
        ;;
esac

cd "$PROJECT_ROOT" || exit 1

case "$ACTION" in
    start)
        echo "Starting $SERVICE container..."
        docker-compose -f docker/docker-compose.yml up -d "$SERVICE"
        echo "$SERVICE container started on http://localhost:$PORT"
        ;;
    stop)
        echo "Stopping $SERVICE container..."
        docker-compose -f docker/docker-compose.yml stop "$SERVICE"
        echo "$SERVICE container stopped"
        ;;
    restart)
        echo "Restarting $SERVICE container..."
        docker-compose -f docker/docker-compose.yml restart "$SERVICE"
        echo "$SERVICE container restarted"
        ;;
    logs)
        docker-compose -f docker/docker-compose.yml logs -f "$SERVICE"
        ;;
    status)
        docker-compose -f docker/docker-compose.yml ps "$SERVICE"
        ;;
    *)
        echo "Error: Invalid action '$ACTION'. Use 'start', 'stop', 'restart', 'logs', or 'status'"
        usage
        ;;
esac


