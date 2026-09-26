from database import get_connection


# ==========================================
# GET ALL SALES
# ==========================================

def get_all_sales():

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            sale_id,
            sale_date,
            product,
            quantity,
            rate,
            total
        FROM sales
        ORDER BY sale_date DESC, sale_id DESC
    """)

    records = cursor.fetchall()

    cursor.close()
    connection.close()

    for record in records:

        if record["sale_date"]:
            record["sale_date"] = record["sale_date"].isoformat()

        record["quantity"] = float(record["quantity"])
        record["rate"] = float(record["rate"])
        record["total"] = float(record["total"])

    return records


# ==========================================
# ADD SALE
# ==========================================

def add_sale(
    sale_date,
    product,
    quantity,
    rate
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO sales
        (
            sale_date,
            product,
            quantity,
            rate
        )
        VALUES (%s, %s, %s, %s)
    """, (
        sale_date,
        product,
        quantity,
        rate
    ))

    connection.commit()

    sale_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return sale_id


# ==========================================
# UPDATE SALE
# ==========================================

def update_sale(
    sale_id,
    sale_date,
    product,
    quantity,
    rate
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE sales
        SET
            sale_date = %s,
            product = %s,
            quantity = %s,
            rate = %s
        WHERE sale_id = %s
    """, (
        sale_date,
        product,
        quantity,
        rate,
        sale_id
    ))

    connection.commit()

    affected_rows = cursor.rowcount

    cursor.close()
    connection.close()

    return affected_rows


# ==========================================
# DELETE SALE
# ==========================================

def delete_sale(sale_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM sales
        WHERE sale_id = %s
    """, (
        sale_id,
    ))

    connection.commit()

    affected_rows = cursor.rowcount

    cursor.close()
    connection.close()

    return affected_rows