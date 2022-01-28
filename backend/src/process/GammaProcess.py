import base64
import urllib

import requests
from flask import session, Response

from HttpResponse import HttpResponse, get_with_error, get_with_data, get_with_response
from config.gamma_config import GAMMA_ME_URI, GAMMA_CLIENT_ID, GAMMA_REDIRECT_URI, GAMMA_AUTHORIZATION_URI, \
    GAMMA_SECRET, GAMMA_TOKEN_URI
from validation.Validation import validate_str


def handle_gamma_me() -> HttpResponse:
    if "token" in session:
        headers = {
            "Authorization": "Bearer {token}".format(token={session["token"]})
        }

        res = requests.get(GAMMA_ME_URI, headers=headers)
        if res.ok:
            return get_with_response(Response(response=res, status=200))

    response_type = "response_type=code"
    client_id = f"client_id={GAMMA_CLIENT_ID}"
    redirect_uri = f"redirect_uri={GAMMA_REDIRECT_URI}"

    response = f"{GAMMA_AUTHORIZATION_URI}?{response_type}&{client_id}&{redirect_uri}"
    headers = {
        "location": response
    }
    return get_with_response(Response(response=response, headers=headers, status=401))


def handle_gamma_auth(data: dict) -> HttpResponse:
    code_res = validate_str(data, "code")
    if code_res.is_error:
        return get_with_error(400, code_res.message)
    code = code_res.data

    data = {
        'grant_type': 'authorization_code',
        'client_id': GAMMA_CLIENT_ID,
        'redirect_uri': GAMMA_REDIRECT_URI,
        'code': code
    }

    c = f"{GAMMA_CLIENT_ID}:{GAMMA_SECRET}"

    encoded_bytes = base64.b64encode(c.encode("utf-8"))
    encoded_str = str(encoded_bytes, "utf-8")

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f'Basic {encoded_str}'
    }

    res = requests.post(f"{GAMMA_TOKEN_URI}?{urllib.parse.urlencode(data)}", headers=headers)
    if res.status_code != 200:
        print(f"Error communicating with gamma status code {res.status_code} > {res.raw}")
        return get_with_error(500, "Gamma error")

    res_json = res.json()
    if "access_token" not in res_json:
        return get_with_error(400, "Invalid token")

    token = res.json()["access_token"]
    gamma_me_headers = {
        "Authorization": f"Bearer {token}"
    }
    gamma_me_res = requests.get(GAMMA_ME_URI, headers=gamma_me_headers)

    if gamma_me_res.ok:
        gamma_me_json = gamma_me_res.json()
        for group in gamma_me_json["groups"]:
            super_group = group["superGroup"]
            if group["active"] and super_group["name"] == "styrit":
                if res.ok:
                    session["token"] = token
                    return get_with_data({})

        return get_with_error(403, "Must be a member of styrIT")
    else:
        return get_with_error(500, f"Unable to communicate with Gamma, code '{res.status_code}', content '{res.content}'")
