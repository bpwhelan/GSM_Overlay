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
            # Send 2 word-level coordinate test cases on connect
            boxes1 = [
    {
        "sentence": "PTT",
        "words": [
            {
                "word": "PTT",
                "x1": 1175,
                "y1": 205,
                "x2": 1371,
                "y2": 245
            }
        ]
    },
    {
        "sentence": "140.85",
        "words": [
            {
                "word": "140.85",
                "x1": 1174,
                "y1": 498,
                "x2": 1498,
                "y2": 604
            }
        ]
    },
    {
        "sentence": "MEMORY",
        "words": [
            {
                "word": "MEMORY",
                "x1": 1112,
                "y1": 712,
                "x2": 1434,
                "y2": 752
            }
        ]
    },
    {
        "sentence": "今はディープ・スロートという男の言うこと",
        "words": [
            {
                "word": "今",
                "x1": 545,
                "y1": 881,
                "x2": 621,
                "y2": 958
            },
            {
                "word": "は",
                "x1": 621,
                "y1": 881,
                "x2": 695,
                "y2": 958
            },
            {
                "word": "ディープ",
                "x1": 698,
                "y1": 882,
                "x2": 986,
                "y2": 958
            },
            {
                "word": "・",
                "x1": 992,
                "y1": 881,
                "x2": 1008,
                "y2": 958
            },
            {
                "word": "スロート",
                "x1": 1023,
                "y1": 882,
                "x2": 1301,
                "y2": 958
            },
            {
                "word": "という",
                "x1": 1320,
                "y1": 882,
                "x2": 1513,
                "y2": 958
            },
            {
                "word": "男",
                "x1": 1527,
                "y1": 881,
                "x2": 1589,
                "y2": 958
            },
            {
                "word": "の",
                "x1": 1600,
                "y1": 881,
                "x2": 1666,
                "y2": 958
            },
            {
                "word": "言う",
                "x1": 1671,
                "y1": 882,
                "x2": 1802,
                "y2": 958
            },
            {
                "word": "こと",
                "x1": 1819,
                "y1": 882,
                "x2": 1949,
                "y2": 958
            }
        ]
    },
    {
        "sentence": "を信じてみよう。リモコンミサイルで核弾頭",
        "words": [
            {
                "word": "を",
                "x1": 557,
                "y1": 998,
                "x2": 617,
                "y2": 1077
            },
            {
                "word": "信じ",
                "x1": 625,
                "y1": 998,
                "x2": 757,
                "y2": 1077
            },
            {
                "word": "て",
                "x1": 769,
                "y1": 998,
                "x2": 835,
                "y2": 1077
            },
            {
                "word": "み",
                "x1": 840,
                "y1": 998,
                "x2": 906,
                "y2": 1077
            },
            {
                "word": "よう",
                "x1": 919,
                "y1": 998,
                "x2": 1048,
                "y2": 1077
            },
            {
                "word": "。",
                "x1": 1062,
                "y1": 998,
                "x2": 1088,
                "y2": 1077
            },
            {
                "word": "リモコン",
                "x1": 1147,
                "y1": 998,
                "x2": 1410,
                "y2": 1077
            },
            {
                "word": "ミサイル",
                "x1": 1425,
                "y1": 998,
                "x2": 1697,
                "y2": 1077
            },
            {
                "word": "で",
                "x1": 1709,
                "y1": 998,
                "x2": 1772,
                "y2": 1077
            },
            {
                "word": "核",
                "x1": 1777,
                "y1": 998,
                "x2": 1844,
                "y2": 1077
            },
            {
                "word": "弾頭",
                "x1": 1847,
                "y1": 998,
                "x2": 1990,
                "y2": 1077
            }
        ]
    },
    {
        "sentence": "保存棟地下二階北西の配電盤を壊すんだ。",
        "words": [
            {
                "word": "保存",
                "x1": 547,
                "y1": 1113,
                "x2": 695,
                "y2": 1191
            },
            {
                "word": "棟",
                "x1": 689,
                "y1": 1113,
                "x2": 767,
                "y2": 1190
            },
            {
                "word": "地下",
                "x1": 763,
                "y1": 1113,
                "x2": 910,
                "y2": 1190
            },
            {
                "word": "二",
                "x1": 913,
                "y1": 1113,
                "x2": 980,
                "y2": 1190
            },
            {
                "word": "階",
                "x1": 992,
                "y1": 1113,
                "x2": 1053,
                "y2": 1190
            },
            {
                "word": "北西",
                "x1": 1059,
                "y1": 1113,
                "x2": 1199,
                "y2": 1190
            },
            {
                "word": "の",
                "x1": 1204,
                "y1": 1113,
                "x2": 1272,
                "y2": 1190
            },
            {
                "word": "配電",
                "x1": 1275,
                "y1": 1113,
                "x2": 1414,
                "y2": 1190
            },
            {
                "word": "盤",
                "x1": 1420,
                "y1": 1113,
                "x2": 1486,
                "y2": 1190
            },
            {
                "word": "を",
                "x1": 1493,
                "y1": 1113,
                "x2": 1555,
                "y2": 1190
            },
            {
                "word": "壊す",
                "x1": 1563,
                "y1": 1113,
                "x2": 1699,
                "y2": 1190
            },
            {
                "word": "んだ",
                "x1": 1709,
                "y1": 1113,
                "x2": 1848,
                "y2": 1190
            },
            {
                "word": "。",
                "x1": 1852,
                "y1": 1113,
                "x2": 1880,
                "y2": 1190
            }
        ]
    }
]
            await websocket.send(json.dumps(boxes1))
            await asyncio.sleep(5)

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
    
