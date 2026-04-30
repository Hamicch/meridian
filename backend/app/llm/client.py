from openai import AsyncOpenAI
from ..configs.settings import OPENAI_API_KEY

client = AsyncOpenAI(api_key=OPENAI_API_KEY)
