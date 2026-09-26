from database import get_connection


# ==========================================
# GET ALL EXPENSES
# ==========================================

def get_all_expenses():

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            expense_id,
            expense_date,
            category,
            description,
            amount
        FROM expenses
        ORDER BY expense_date DESC, expense_id DESC
    """)

    records = cursor.fetchall()

    cursor.close()
    connection.close()

    for record in records:

        if record["expense_date"]:
            record["expense_date"] = record["expense_date"].isoformat()

        record["amount"] = float(record["amount"])

    return records


# ==========================================
# ADD EXPENSE
# ==========================================

def add_expense(
    expense_date,
    category,
    description,
    amount
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO expenses
        (
            expense_date,
            category,
            description,
            amount
        )
        VALUES (%s, %s, %s, %s)
    """, (
        expense_date,
        category,
        description,
        amount
    ))

    connection.commit()

    expense_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return expense_id


# ==========================================
# UPDATE EXPENSE
# ==========================================

def update_expense(
    expense_id,
    expense_date,
    category,
    description,
    amount
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE expenses
        SET
            expense_date = %s,
            category = %s,
            description = %s,
            amount = %s
        WHERE expense_id = %s
    """, (
        expense_date,
        category,
        description,
        amount,
        expense_id
    ))

    connection.commit()

    affected_rows = cursor.rowcount

    cursor.close()
    connection.close()

    return affected_rows


# ==========================================
# DELETE EXPENSE
# ==========================================

def delete_expense(expense_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM expenses
        WHERE expense_id = %s
    """, (
        expense_id,
    ))

    connection.commit()

    affected_rows = cursor.rowcount

    cursor.close()
    connection.close()

    return affected_rows