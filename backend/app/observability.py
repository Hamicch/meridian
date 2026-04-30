import os
from langtrace_python_sdk import langtrace


def init() -> None:
    langtrace.init(api_key=os.environ["LANGTRACE_API_KEY"])
