
# Validates an admin password.
import os
from typing import Dict

from HttpResponse import HttpResponse, get_with_error, get_with_data


def validate_password(response_json: Dict) -> HttpResponse:
    if response_json is None or "pass" not in response_json:
        return get_with_error(400, "Bad Request")
    password = response_json["pass"]
    correct_password = os.environ.get("frontend_admin_pass", "asd123")
    if password != correct_password:
        return get_with_error(401, "Invalid password")
    return get_with_data({})