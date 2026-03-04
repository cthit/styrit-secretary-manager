import base64
import hashlib
import secrets
import urllib

import requests
from flask import session, Response

from HttpResponse import HttpResponse, get_with_error, get_with_data, get_with_response
from config.gamma_config import (
    GAMMA_USERINFO_URI, GAMMA_CLIENT_ID, GAMMA_REDIRECT_URI, GAMMA_AUTHORIZATION_URI,
    GAMMA_SECRET, GAMMA_TOKEN_URI
)
from validation.Validation import validate_str


def build_auth_redirect_url() -> str:
    code_verifier = secrets.token_urlsafe(32)
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).rstrip(b'=').decode()
    session['pkce_verifier'] = code_verifier

    params = (
        f"response_type=code"
        f"&client_id={GAMMA_CLIENT_ID}"
        f"&redirect_uri={GAMMA_REDIRECT_URI}"
        f"&scope=openid+profile"
        f"&code_challenge={code_challenge}"
        f"&code_challenge_method=S256"
    )
    return f"{GAMMA_AUTHORIZATION_URI}?{params}"


def handle_gamma_me() -> HttpResponse:
    if "token" in session:
        headers = {
            "Authorization": "Bearer {token}".format(token={session["token"]})
        }

        res = requests.get(GAMMA_USERINFO_URI, headers=headers)
        if res.ok:
            return get_with_response(Response(response=res, status=200))

    response = build_auth_redirect_url()
    headers = {
        "location": response
    }
    return get_with_response(Response(response=response, headers=headers, status=401))


def handle_gamma_auth(data: dict) -> HttpResponse:
    code_res = validate_str(data, "code")
    if code_res.is_error:
        return get_with_error(400, code_res.message)
    code = code_res.data

    code_verifier = session.pop('pkce_verifier', '')
    if not code_verifier:
        print("WARNING: code_verifier not found in session")

    token_data = {
        'grant_type': 'authorization_code',
        'client_id': GAMMA_CLIENT_ID,
        'redirect_uri': GAMMA_REDIRECT_URI,
        'code': code,
        'code_verifier': code_verifier
    }

    c = f"{GAMMA_CLIENT_ID}:{GAMMA_SECRET}"

    encoded_bytes = base64.b64encode(c.encode("utf-8"))
    encoded_str = str(encoded_bytes, "utf-8")

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f'Basic {encoded_str}'
    }

    res = requests.post(GAMMA_TOKEN_URI, data=urllib.parse.urlencode(token_data), headers=headers)

    if res.status_code != 200:
        print(f"Error exchanging code for token: {res.status_code}")
        print(f"Response: {res.text[:200]}")
        return get_with_error(500, f"Gamma error: {res.status_code}")

    try:
        res_json = res.json()
    except Exception as e:
        print(f"Failed to parse token response as JSON: {e}")
        return get_with_error(500, "Invalid token response format")

    if "access_token" not in res_json:
        print(f"No access_token in response")
        return get_with_error(400, "Invalid token response")

    token = res_json["access_token"]

    gamma_me_headers = {
        "Authorization": f"Bearer {token}"
    }
    gamma_me_res = requests.get(GAMMA_USERINFO_URI, headers=gamma_me_headers)

    if not gamma_me_res.ok:
        print(f"Error fetching userinfo: {gamma_me_res.status_code}")
        return get_with_error(500, f"Userinfo error: {gamma_me_res.status_code}")

    session["token"] = token
    return get_with_data({})
