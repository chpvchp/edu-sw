import asyncio
from modules_dev.chpvchp.llama_cpp import llama_cpp_stream

body = {
    "model": "model",
    "messages": [
        {
            "role": "user",
            "content": "Bạn là ai?"
        }
    ]
}

async def main():
    async for line in llama_cpp_stream(body):
        print(line)

asyncio.run(main())