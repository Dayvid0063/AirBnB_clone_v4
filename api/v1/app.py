#!/usr/bin/python3
"""Flask App integration"""


from api.v1.views import app_views
from flask import Flask, jsonify
from flask_cors import CORS
from models import storage
import os


app = Flask(__name__)
app.url_map.strict_slashes = False
host = os.getenv('HBNB_API_HOST', '0.0.0.0')
port = os.getenv('HBNB_API_PORT', 5000)
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})
app.register_blueprint(app_views)


@app.teardown_appcontext
def teardown_db(exception):
    """close storage"""
    storage.close()


@app.errorhandler(404)
def error_404(error):
    """404 error handler"""
    return jsonify(error='Not found'), 404


@app.errorhandler(400)
def error_400(error):
    """400 error handler"""
    info = 'Bad request'
    if isinstance(error, Exception) and hasattr(error, 'description'):
        info = error.description
    return jsonify(error=info), 400


if __name__ == "__main__":
    """Flask App"""
    app.run(
        host=host,
        port=port,
        threaded=True
    )
