"""
SheetAPI - Python Usage Examples
Requires: pip install requests
"""

import requests
import json

BASE_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
API_KEY = "sk_your_api_key_here"


def get_all(sheet: str) -> list:
    r = requests.get(BASE_URL, params={"key": API_KEY, "action": "read", "sheet": sheet}, timeout=30)
    r.raise_for_status()
    data = r.json()
    if not data.get("ok"): raise ValueError(data.get("error"))
    return data["data"]


def filter_rows(sheet: str, **filters) -> list:
    params = {"key": API_KEY, "action": "read", "sheet": sheet, **filters}
    r = requests.get(BASE_URL, params=params, timeout=30)
    r.raise_for_status()
    return r.json()["data"]


def create_row(sheet: str, data: dict) -> dict:
    r = requests.post(BASE_URL, params={"key": API_KEY, "action": "create", "sheet": sheet},
                      data=json.dumps(data), headers={"Content-Type": "application/json"}, timeout=30)
    return r.json()


def update_row(sheet: str, row: int, data: dict) -> dict:
    r = requests.post(BASE_URL, params={"key": API_KEY, "action": "update", "sheet": sheet, "row": row},
                      data=json.dumps(data), headers={"Content-Type": "application/json"}, timeout=30)
    return r.json()


def delete_row(sheet: str, row: int) -> dict:
    r = requests.post(BASE_URL, params={"key": API_KEY, "action": "delete", "sheet": sheet, "row": row},
                      data=json.dumps({}), headers={"Content-Type": "application/json"}, timeout=30)
    return r.json()
