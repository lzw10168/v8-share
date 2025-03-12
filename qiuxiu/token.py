import requests
from moviepy.editor import *
# import secure-smtplib
import os


from threading import Thread
from datetime import datetime, timedelta
import json
logging = {
    "info": print,
    "error": print
}

# Token 相关配置
TOKEN_FILE = "token.json"
TOKEN_VALIDITY = 15  # 15 days
INIT_URL = "https://i.shootz.tech/user-api/mini/wx/init"
def save_token(token_info):
    """保存 Token 到本地文件"""
    with open(TOKEN_FILE, 'w') as f:
        json.dump(token_info, f)

def load_token():
    """从本地文件加载 Token"""
    try:
        with open(TOKEN_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None

def is_token_expired(token_info):
    """检查 Token 是否过期"""
    if not token_info:
        return True
    expire_time = datetime.strptime(token_info['expireTime'], "%Y-%m-%dT%H:%M:%S.%f%z")
    return expire_time < datetime.now(expire_time.tzinfo) + timedelta(days=TOKEN_VALIDITY)

def get_valid_token():
    """获取有效的 Token，如果过期则重新获取"""
    token_info = load_token()
    if not token_info or is_token_expired(token_info):
        logging.info("Token is expired or not found. Fetching new token...")
        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
        payload = {
            "code": "0e3uRbml2H2o8f4Ynbll2lvkZm3uRbmj",
            "changeLoginState": 1
        }
        try:
            response = requests.post(INIT_URL, headers=headers, json=payload)
            response.raise_for_status()
            token_info = response.json()
            save_token(token_info)
            logging.info(f"New token fetched: {token_info['token']}")
        except requests.RequestException as e:
            logging.error(f"Error fetching token: {e}")
            return None
    return token_info
