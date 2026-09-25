from flask import Flask, jsonify, request
from flask_cors import CORS

from database import get_connection

from milk import (
    get_all_milk,
    add_milk,
    update_milk,
    delete_milk
)


app = Flask(__name__)

CORS(app)


# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():

    return jsonify({
        "message": "Farm Management API is running"
    })


# ==========================================
# TEST DATABASE
# ==========================================

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


# ==========================================
# GET ALL MILK
# ==========================================

@app.route("/api/milk", methods=["GET"])
def get_milk():

    try:

        records = get_all_milk()

        return jsonify({
            "success": True,
            "records": records
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# ADD MILK
# ==========================================

@app.route("/api/milk", methods=["POST"])
def create_milk():

    try:

        data = request.get_json()

        record_date = data.get("record_date")
        quantity = data.get("quantity")
        rate = data.get("rate")

        if not record_date or quantity is None or rate is None:

            return jsonify({
                "success": False,
                "error": "Date, quantity and rate are required"
            }), 400

        quantity = float(quantity)
        rate = float(rate)

        if quantity <= 0 or rate <= 0:

            return jsonify({
                "success": False,
                "error": "Quantity and rate must be greater than 0"
            }), 400

        milk_id = add_milk(
            record_date,
            quantity,
            rate
        )

        return jsonify({
            "success": True,
            "message": "Milk record added successfully",
            "milk_id": milk_id
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# UPDATE MILK
# ==========================================

@app.route("/api/milk/<int:milk_id>", methods=["PUT"])
def edit_milk(milk_id):

    try:

        data = request.get_json()

        record_date = data.get("record_date")
        quantity = data.get("quantity")
        rate = data.get("rate")

        if not record_date or quantity is None or rate is None:

            return jsonify({
                "success": False,
                "error": "Date, quantity and rate are required"
            }), 400

        quantity = float(quantity)
        rate = float(rate)

        if quantity <= 0 or rate <= 0:

            return jsonify({
                "success": False,
                "error": "Quantity and rate must be greater than 0"
            }), 400

        affected_rows = update_milk(
            milk_id,
            record_date,
            quantity,
            rate
        )

        if affected_rows == 0:

            return jsonify({
                "success": False,
                "error": "Milk record not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Milk record updated successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# DELETE MILK
# ==========================================

@app.route("/api/milk/<int:milk_id>", methods=["DELETE"])
def remove_milk(milk_id):

    try:

        affected_rows = delete_milk(milk_id)

        if affected_rows == 0:

            return jsonify({
                "success": False,
                "error": "Milk record not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Milk record deleted successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )