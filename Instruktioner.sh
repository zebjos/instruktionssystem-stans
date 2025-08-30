#!/bin/bash

cd "$(dirname "$0")"

# Start both frontend and backend in the background
npm run start:all &

# Wait until the Vite frontend is live
npx wait-on http://localhost:5173

# Open in default browser
if command -v open >/dev/null; then
  open http://localhost:5173       # macOS
elif command -v xdg-open >/dev/null; then
  xdg-open http://localhost:5173   # Linux
fi

# Keep terminal open to show logs
wait