#!/bin/sh
set -e

if [ -z "$MODE" ]; then
  echo "ERROR: MODE environment variable not set"
  echo "Usage: MODE=api or MODE=web"
  exit 1
fi

case "$MODE" in
  api)
    echo "Starting API server on port 5678..."
    exec python -m server.main
    ;;
  web)
    echo "Starting Web server on port 3000..."
    exec npm run start -- -H 0.0.0.0 -p 3000
    ;;
  *)
    echo "ERROR: Invalid MODE='$MODE'. Use MODE=api or MODE=web"
    exit 1
    ;;
esac
