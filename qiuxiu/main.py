from flask import Flask, request, jsonify
import requests
from moviepy.editor import *
# import secure-smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
import uuid
import os
# import logging
from threading import Thread
from datetime import datetime, timedelta
import json
from token import  get_valid_token
import logging
app = Flask(__name__)
# logging.basicConfig(level=logging.INFO, filename='app.log', format='%(asctime)s - %(levelname)s - %(message)s')

# 配置邮件发送
SMTP_SERVER = "smtp.example.com"
SMTP_PORT = 587
SMTP_USER = "your_email@example.com"
SMTP_PASSWORD = "your_password"

# 外部 API 配置
ARENA_URL = "https://i.shootz.tech/arenas-api/mini/arena"
SEARCH_URL = "https://i.shootz.tech/arenas-api/mini/arena/search"
COURT_URL = "https://i.shootz.tech/arenas-api/mini/arena/{}/court"
HIGHLIGHTS_URL = "https://i.shootz.tech/highlights-api/mini/video/opt-videos-classification"

# 用于存储合成视频的路径
OUTPUT_FOLDER = "videos/"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route('/arena', methods=['GET'])
def arena():
    """查询场次信息"""
    logging.info("Request to /arena")
    token_info = get_valid_token()
    if not token_info:
        return jsonify({"error": "Failed to fetch token"}), 500

    headers = {
        'Authorization': f"Bearer {token_info['token']}",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    params = {
        'longitude': request.args.get('longitude'),
        'latitude': request.args.get('latitude'),
        'page': request.args.get('page', 0),
        'limit': request.args.get('limit', 10),
        'searchType': request.args.get('searchType', 2)
    }
    try:
        response = requests.get(ARENA_URL, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Arena data retrieved: {len(data['data'])} entries")
        return jsonify(data)
    except requests.RequestException as e:
        logging.error(f"Error fetching arena data: {e}")
        return jsonify({"error": "Failed to fetch arena data"}), 500

@app.route('/search', methods=['GET'])
def search():
    """搜索篮球场信息"""
    logging.info("Request to /search")
    token_info = get_valid_token()
    if not token_info:
        return jsonify({"error": "Failed to fetch token"}), 500

    headers = {
        'Authorization': f"Bearer {token_info['token']}",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    params = {
        'arenaName': request.args.get('arenaName'),
        'longitude': request.args.get('longitude'),
        'latitude': request.args.get('latitude'),
        'searchType': request.args.get('searchType', 2)
    }
    try:
        response = requests.get(SEARCH_URL, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Search results: {len(data['data'])} entries")
        return jsonify(data)
    except requests.RequestException as e:
        logging.error(f"Error searching arenas: {e}")
        return jsonify({"error": "Failed to search arenas"}), 500

@app.route('/court/<arena_id>', methods=['GET'])
def court(arena_id):
    """查询场馆信息"""
    logging.info(f"Request to /court/{arena_id}")
    token_info = get_valid_token()
    if not token_info:
        return jsonify({"error": "Failed to fetch token"}), 500

    headers = {
        'Authorization': f"Bearer {token_info['token']}",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    url = COURT_URL.format(arena_id)
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Court data retrieved: {len(data)} entries")
        return jsonify(data)
    except requests.RequestException as e:
        logging.error(f"Error fetching court data: {e}")
        return jsonify({"error": "Failed to fetch court data"}), 500

@app.route('/highlights', methods=['GET'])
def highlights():
    """获取精彩进球数据"""
    logging.info("Request to /highlights")
    token_info = get_valid_token()
    if not token_info:
        return jsonify({"error": "Failed to fetch token"}), 500

    headers = {
        'Authorization': f"Bearer {token_info['token']}",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    params = {
        'arenaId': request.args.get('arenaId'),
        'courts': request.args.get('courts'),
        'videoStartTime': request.args.get('videoStartTime'),
        'videoEndTime': request.args.get('videoEndTime')
    }
    try:
        response = requests.get(HIGHLIGHTS_URL, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Highlights data retrieved: {len(data)} entries")
        return jsonify(data)
    except requests.RequestException as e:
        logging.error(f"Error fetching highlights data: {e}")
        return jsonify({"error": "Failed to fetch highlights data"}), 500

# 合成视频和邮件发送接口保持不变...

if __name__ == '__main__':
    app.run(debug=True)
