from core.database.connect import connection_database

with connection_database() as conn:
    with conn.cursor() as cur:
        cur.execute("select * from public.exams;")
        data = cur.fetchall()
        print(data)