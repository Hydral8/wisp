#!/bin/bash
# Wisp Instant - Stop all services

echo "Stopping Wisp services..."
echo ""

PORTS=(8000 8001 3001 3210 6790)
STOPPED=0

for PORT in "${PORTS[@]}"; do
    PID=$(lsof -ti:$PORT 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "Stopping service on port :$PORT (PID: $PID)"
        kill -9 $PID 2>/dev/null
        STOPPED=$((STOPPED + 1))
    else
        echo "Port :$PORT - no service running"
    fi
done

echo ""
if [ $STOPPED -gt 0 ]; then
    echo "Stopped $STOPPED service(s)"
else
    echo "No services were running"
fi
echo ""
