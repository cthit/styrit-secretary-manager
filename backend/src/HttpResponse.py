from typing import Tuple

from flask import Response


class HttpResponse:
    def __init__(self, code: int = 200, error: str = None, data=None, file=None, response: Response=None):
        self.code = code
        self.error = error
        self.data = data
        self.file = file
        self.response = response

    def get_response(self) -> Tuple[dict, int]:
        if self.code != 200 or self.error is not None:
            return {
                "data": {},
                "error": {
                    "isError": True,
                    "message": self.error
                }
            }, self.code
        elif self.response is not None:
            return self.response
        elif self.file is not None:
            return self.file

        return {
            "data": self.data,
            "error": {
                "isError": False,
                "message": ""
            }
        }, 200

    def is_error(self):
        return self.code != 200


def get_with_error(code: int, error: str):
    return HttpResponse(code=code, error=error)


def get_with_data(data: dict):
    return HttpResponse(data=data)


def get_with_file(file):
    return HttpResponse(file=file)


def get_with_response(response: Response):
    return HttpResponse(response=response)