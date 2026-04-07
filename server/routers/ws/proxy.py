"""WebSocket proxy routes for app-role backend.

In app mode, high-load stream processing runs on a separate AI backend.
These routes preserve the same public paths (/ws/feed, /ws/camera)
while tunneling traffic to the AI upstream.
"""

import asyncio
import logging

import websockets
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from server.config import AI_WS_UPSTREAM_URL

logger = logging.getLogger(__name__)
router = APIRouter()


async def _pipe_client_to_upstream(client_ws: WebSocket, upstream_ws: websockets.WebSocketClientProtocol) -> None:
    try:
        while True:
            message = await client_ws.receive()
            msg_type = message.get("type")
            if msg_type == "websocket.disconnect":
                break

            payload_bytes = message.get("bytes")
            payload_text = message.get("text")
            if payload_bytes is not None:
                await upstream_ws.send(payload_bytes)
            elif payload_text is not None:
                await upstream_ws.send(payload_text)
    except WebSocketDisconnect:
        pass


async def _pipe_upstream_to_client(upstream_ws: websockets.WebSocketClientProtocol, client_ws: WebSocket) -> None:
    async for payload in upstream_ws:
        if isinstance(payload, bytes):
            await client_ws.send_bytes(payload)
        else:
            await client_ws.send_text(payload)


async def _proxy_websocket(client_ws: WebSocket, upstream_path: str) -> None:
    await client_ws.accept()
    upstream_uri = f"{AI_WS_UPSTREAM_URL}{upstream_path}"

    try:
        async with websockets.connect(upstream_uri, ping_interval=None, max_size=None) as upstream_ws:
            c2u = asyncio.create_task(_pipe_client_to_upstream(client_ws, upstream_ws))
            u2c = asyncio.create_task(_pipe_upstream_to_client(upstream_ws, client_ws))

            done, pending = await asyncio.wait({c2u, u2c}, return_when=asyncio.FIRST_COMPLETED)

            for task in pending:
                task.cancel()
            await asyncio.gather(*pending, return_exceptions=True)
            for task in done:
                await asyncio.gather(task, return_exceptions=True)
    except Exception:
        logger.warning("AI upstream unavailable for %s", upstream_path, exc_info=True)
        try:
            await client_ws.close(code=1011)
        except Exception:
            pass


@router.websocket("/ws/feed")
async def proxy_feed(ws: WebSocket) -> None:
    await _proxy_websocket(ws, "/ws/feed")


@router.websocket("/ws/camera")
async def proxy_camera(ws: WebSocket) -> None:
    await _proxy_websocket(ws, "/ws/camera")
