from flask import Flask, jsonify
from flask_cors import CORS
from database import get_connection

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Farm Management API is running"
    })


@app.route("/api/test-db")
def test_database():
    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT DATABASE()")
        database = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "database": database
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)