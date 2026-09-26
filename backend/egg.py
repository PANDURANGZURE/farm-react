from database import get_connection


# ==========================================
# GET ALL EGG RECORDS
# ==========================================

def get_all_eggs():

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            egg_id,
            record_date,
            quantity,
            rate,
            total
        FROM egg_records
        ORDER BY record_date DESC, egg_id DESC
    """)

    records = cursor.fetchall()

    cursor.close()
    connection.close()

    for record in records:

        if record["record_date"]:
            record["record_date"] = record["record_date"].isoformat()

        record["quantity"] = int(record["quantity"])
        record["rate"] = float(record["rate"])
        record["total"] = float(record["total"])

    return records


# ==========================================
# ADD EGG RECORD
# ==========================================

def add_egg(record_date, quantity, rate):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO egg_records
        (record_date, quantity, rate)
        VALUES (%s, %s, %s)
    """, (
        record_date,
        quantity,
        rate
    ))

    connection.commit()

    egg_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return egg_id


# ==========================================
# UPDATE EGG RECORD
# ==========================================

def update_egg(
    egg_id,
    record_date,
    quantity,
    rate
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE egg_records
        SET
            record_date = %s,
            quantity = %s,
            rate = %s
        WHERE egg_id = %s
    """, (
        record_date,
        quantity,
        rate,
        egg_id
    ))

    connection.commit()

    affected_rows = cursor.rowcount

    cursor.close()
    connection.close()

    return affected_rows


# ==========================================
# DELETE EGG RECORD
# ==========================================

def delete_egg(egg_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM egg_records
        WHERE egg_id = %s
    """, (
        egg_id,
    ))

    connection.commit()

    affected_rows = cursor.rowcount

    cursor.close()
    connection.close()

    return affected_rows