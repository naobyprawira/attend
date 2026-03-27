import argparse
import asyncio
import cv2
import struct
import time
import websockets


async def stream(server: str, port: int, camera_index: int, no_preview: bool):
    uri = f"ws://{server}:{port}/ws/camera"
    cap = cv2.VideoCapture(camera_index)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    if not cap.isOpened():
        print("[!] Cannot open camera")
        return

    print(f"[*] Camera opened (index {camera_index})")
    fps_target = 15
    frame_interval = 1.0 / fps_target
    encode_params = [cv2.IMWRITE_JPEG_QUALITY, 70]

    while True:
        try:
            async with websockets.connect(uri, ping_interval=None) as ws:
                print(f"[+] Connected to {uri}")
                while True:
                    t0 = time.time()
                    ret, frame = cap.read()
                    if not ret:
                        print("[!] Frame read failed, retrying...")
                        await asyncio.sleep(0.5)
                        continue

                    # Encode to JPEG
                    ok, jpeg = cv2.imencode(".jpg", frame, encode_params)
                    if not ok:
                        continue

                    # Prepend 8-byte capture timestamp (epoch ms) to JPEG
                    ts_bytes = struct.pack('>d', time.time() * 1000)
                    await ws.send(ts_bytes + jpeg.tobytes())

                    # Local preview
                    if not no_preview:
                        cv2.imshow("Attend.ai Camera", frame)
                        if cv2.waitKey(1) & 0xFF == ord("q"):
                            cap.release()
                            cv2.destroyAllWindows()
                            return

                    # Rate limit
                    elapsed = time.time() - t0
                    if elapsed < frame_interval:
                        await asyncio.sleep(frame_interval - elapsed)

        except (websockets.exceptions.ConnectionClosed, ConnectionRefusedError, OSError) as e:
            print(f"[!] Connection lost ({e}), reconnecting in 2s...")
            await asyncio.sleep(2)

    cap.release()
    cv2.destroyAllWindows()


def main():
    parser = argparse.ArgumentParser(description="Attend.ai - camera client")
    parser.add_argument("--server", default="127.0.0.1", help="Server IP")
    parser.add_argument("--port", type=int, default=5678, help="Server port")
    parser.add_argument("--camera", type=int, default=0, help="Camera index")
    parser.add_argument("--no-preview", action="store_true", help="Disable local preview window")
    args = parser.parse_args()
    asyncio.run(stream(args.server, args.port, args.camera, args.no_preview))


if __name__ == "__main__":
    main()
