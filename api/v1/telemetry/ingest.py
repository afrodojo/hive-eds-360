from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

AUTHORIZED_DOMAIN_TOKEN = "eds-360.com-sovereign-token"
TELEMETRY_CACHE_FILE = "/var/www/hive/data/latest_telemetry.json"

@app.route('/api/v1/telemetry/ingest', methods=['POST'])
def receive_enclave_telemetry():
    # 1. Validate Sovereign Domain Header
    auth_header = request.headers.get('X-Domain-Authority')
    if auth_header != AUTHORIZED_DOMAIN_TOKEN:
        return jsonify({"error": "Unauthorized Domain Source"}), 403

    # 2. Parse Incoming Telemetry JSON Payload
    data = request.get_json()
    if not data or data.get("domain") != "eds-360.com":
        return jsonify({"error": "Invalid Payload Identifier"}), 400

    # 3. Store Latest Feed for Mobile & On-The-Go Rendering
    os.makedirs(os.path.dirname(TELEMETRY_CACHE_FILE), exist_ok=True)
    with open(TELEMETRY_CACHE_FILE, "w") as f:
        json.dump(data, f, indent=2)

    return jsonify({
        "status": "INGESTED",
        "message": "Enclave telemetry successfully synchronized to hive.eds-360.com",
        "timestamp_utc": data.get("timestamp_utc")
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
