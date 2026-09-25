from database import get_connection


# ==========================================
# GET ALL MILK RECORDS
# ==========================================

def get_all_milk():

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            milk_id,
            record_date,
            quantity,
            rate,
            total
        FROM milk_records
        ORDER BY record_date DESC, milk_id DESC
    """)

    records = cursor.fetchall()

    cursor.close()
    connection.close()

    for record in records:

        if record["record_date"]:
            record["record_date"] = record["record_date"].isoformat()

        record["quantity"] = float(record["quantity"])
        record["rate"] = float(record["rate"])
        record["total"] = float(record["total"])

    return records


# ==========================================
# ADD MILK RECORD
# ==========================================

def add_milk(record_date, quantity, rate):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO milk_records
        (record_date, quantity, rate)
        VALUES (%s, %s, %s)
    """, (
        record_date,
        quantity,
        rate
    ))

    connection.commit()

    milk_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return milk_id


# ==========================================
# UPDATE MILK RECORD
# ==========================================

def update_milk(milk_id, record_date, quantity, rate):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE milk_records
        SET
            record_date = %s,
            quantity = %s,
            rate = %s
        WHERE milk_id = %s
    """, (
        record_date,
        quantity,
        rate,
        milk_id
    ))

    connection.commit()

    affected_rows = cursor.rowcount

    cursor.close()
    connection.close()

    return affected_rows


# ==========================================
# DELETE MILK RECORD
# ==========================================

def delete_milk(milk_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM milk_records
        WHERE milk_id = %s
    """, (
        milk_id,
    ))

    connection.commit()

    affected_rows = cursor.rowcount

    cursor.close()
    connection.close()

    return affected_rows