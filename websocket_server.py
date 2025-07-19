import asyncio
import logging
import queue
import threading
import time
import websockets
import json

websocket_server_thread = None
websocket_queue = queue.Queue()
paused = False
    
class WebsocketServerThread(threading.Thread):
    def __init__(self, read, ws_port):
        super().__init__(daemon=True)
        self._loop = None
        self.read = read    
        self.clients = set()
        self._event = threading.Event()
        self.ws_port = ws_port
        self.backedup_text = []

    @property
    def loop(self):
        self._event.wait()
        return self._loop

    async def send_text_coroutine(self, message):
        if not self.clients:
            self.backedup_text.append(message)
            return
        for client in self.clients:
            await client.send(message)

    async def server_handler(self, websocket):
        self.clients.add(websocket)
        try:
            # Send 4 boxes on connect
            boxes1 = [
                {"Sentence": "今日はとても良い天気ですね", "X1": 100, "Y1": 100, "X2": 300, "Y2": 150, "fontSize": 32},
                {"Sentence": "私は寿司が大好きです", "X1": 350, "Y1": 100, "X2": 550, "Y2": 150, "fontSize": 32},
                {"Sentence": "日本語を勉強しています", "X1": 100, "Y1": 200, "X2": 300, "Y2": 250, "fontSize": 32},
                {"Sentence": "東京に行きたいです", "X1": 350, "Y1": 200, "X2": 550, "Y2": 250, "fontSize": 32}
            ]
            await websocket.send(json.dumps(boxes1))
            await asyncio.sleep(5)
            # Send 4 different boxes
            boxes2 = [
                {"Sentence": "桜の花がきれいに咲いています", "X1": 150, "Y1": 120, "X2": 400, "Y2": 170, "fontSize": 28},
                {"Sentence": "昨日、新しい本を買いました", "X1": 420, "Y1": 120, "X2": 670, "Y2": 170, "fontSize": 28},
                {"Sentence": "明日は友達と映画を見に行きます", "X1": 150, "Y1": 220, "X2": 400, "Y2": 270, "fontSize": 28},
                {"Sentence": "日本の文化に興味があります", "X1": 420, "Y1": 220, "X2": 670, "Y2": 270, "fontSize": 28}
            ]
            await websocket.send(json.dumps(boxes2))

            if self.backedup_text:
                for message in self.backedup_text:
                    await websocket.send(message)
                self.backedup_text.clear()
            async for message in websocket:
                if self.read and not paused:
                    websocket_queue.put(message)
                    try:
                        await websocket.send('True')
                    except websockets.exceptions.ConnectionClosedOK:
                        pass
                else:
                    try:
                        await websocket.send('False')
                    except websockets.exceptions.ConnectionClosedOK:
                        pass
        except websockets.exceptions.ConnectionClosedError:
            pass
        finally:
            self.clients.remove(websocket)

    async def send_text(self, text):
        if text:
            if isinstance(text, dict):
                text = json.dumps(text)
            return asyncio.run_coroutine_threadsafe(
                self.send_text_coroutine(text), self.loop)

    def stop_server(self):
        self.loop.call_soon_threadsafe(self._stop_event.set)

    def run(self):
        async def main():
            self._loop = asyncio.get_running_loop()
            self._stop_event = stop_event = asyncio.Event()
            self._event.set()
            while True:
                try:
                    self.server = start_server = websockets.serve(self.server_handler,
                                                                  "0.0.0.0",
                                                                  self.ws_port,
                                                                  max_size=1000000000)
                    async with start_server:
                        await stop_event.wait()
                    return
                except Exception as e:
                    logging.warning(f"WebSocket server encountered an error: {e}. Retrying...")
                    await asyncio.sleep(1)

        asyncio.run(main())

if __name__ == "__main__":
    # Start the WebsocketServerThread on your desired port (e.g., 49999)
    WebsocketServerThread(read=True, ws_port=49999).start()
    while True:
        time.sleep(1)
    
