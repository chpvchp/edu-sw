import psycopg
import os

from dotenv import load_dotenv
from psycopg.rows import dict_row

load_dotenv("./.env")

class ConnDB:
    def __init__(self):
        pass

    def connection_database(self):
        return psycopg.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),  
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            row_factory=dict_row
        )
        
    def get_list_exam(self):
        with self.connection_database() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    select id_exam, name_subject, name_exam, duration, created
                    from exams
                    inner join subjects on exams.id_subject = subjects.id_subject
                    """
                )
                return cur.fetchall()