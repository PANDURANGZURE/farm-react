from flask import Flask, jsonify, request
from flask_cors import CORS

# ==========================================
# MILK FUNCTIONS
# ==========================================

from milk import (
    get_all_milk,
    add_milk,
    update_milk,
    delete_milk
)

# ==========================================
# EGG FUNCTIONS
# ==========================================

from egg import (
    get_all_eggs,
    add_egg,
    update_egg,
    delete_egg
)


# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# HOME / TEST ROUTE
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "Farm Management API is running"
    })


# ==========================================================
#                         MILK
# ==========================================================


# ==========================================
# GET ALL MILK RECORDS
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
# ADD MILK RECORD
# ==========================================

@app.route("/api/milk", methods=["POST"])
def create_milk():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "error": "Request body is required"
            }), 400

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

    except ValueError:

        return jsonify({
            "success": False,
            "error": "Quantity and rate must be valid numbers"
        }), 400

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# UPDATE MILK RECORD
# ==========================================

@app.route("/api/milk/<int:milk_id>", methods=["PUT"])
def edit_milk(milk_id):

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "error": "Request body is required"
            }), 400

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

    except ValueError:

        return jsonify({
            "success": False,
            "error": "Quantity and rate must be valid numbers"
        }), 400

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# DELETE MILK RECORD
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


# ==========================================================
#                         EGGS
# ==========================================================


# ==========================================
# GET ALL EGG RECORDS
# ==========================================

@app.route("/api/eggs", methods=["GET"])
def get_eggs():

    try:

        records = get_all_eggs()

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
# ADD EGG RECORD
# ==========================================

@app.route("/api/eggs", methods=["POST"])
def create_egg():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "error": "Request body is required"
            }), 400

        record_date = data.get("record_date")
        quantity = data.get("quantity")
        rate = data.get("rate")

        if not record_date or quantity is None or rate is None:

            return jsonify({
                "success": False,
                "error": "Date, quantity and rate are required"
            }), 400

        quantity = int(quantity)
        rate = float(rate)

        if quantity <= 0 or rate <= 0:

            return jsonify({
                "success": False,
                "error": "Quantity and rate must be greater than 0"
            }), 400

        egg_id = add_egg(
            record_date,
            quantity,
            rate
        )

        return jsonify({
            "success": True,
            "message": "Egg record added successfully",
            "egg_id": egg_id
        }), 201

    except ValueError:

        return jsonify({
            "success": False,
            "error": "Quantity and rate must be valid numbers"
        }), 400

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# UPDATE EGG RECORD
# ==========================================

@app.route("/api/eggs/<int:egg_id>", methods=["PUT"])
def edit_egg(egg_id):

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "error": "Request body is required"
            }), 400

        record_date = data.get("record_date")
        quantity = data.get("quantity")
        rate = data.get("rate")

        if not record_date or quantity is None or rate is None:

            return jsonify({
                "success": False,
                "error": "Date, quantity and rate are required"
            }), 400

        quantity = int(quantity)
        rate = float(rate)

        if quantity <= 0 or rate <= 0:

            return jsonify({
                "success": False,
                "error": "Quantity and rate must be greater than 0"
            }), 400

        affected_rows = update_egg(
            egg_id,
            record_date,
            quantity,
            rate
        )

        if affected_rows == 0:

            return jsonify({
                "success": False,
                "error": "Egg record not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Egg record updated successfully"
        })

    except ValueError:

        return jsonify({
            "success": False,
            "error": "Quantity and rate must be valid numbers"
        }), 400

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# DELETE EGG RECORD
# ==========================================

@app.route("/api/eggs/<int:egg_id>", methods=["DELETE"])
def remove_egg(egg_id):

    try:

        affected_rows = delete_egg(egg_id)

        if affected_rows == 0:

            return jsonify({
                "success": False,
                "error": "Egg record not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Egg record deleted successfully"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# RUN FLASK SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )