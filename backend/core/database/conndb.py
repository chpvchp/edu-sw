import psycopg
import os
import uuid
import json

from dotenv import load_dotenv
from psycopg.rows import dict_row

load_dotenv()

class ConnDB:
    def __init__(self):
        pass

    def connection_database(self):
        try:
            return psycopg.connect(
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT"),  
                dbname=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                row_factory=dict_row
            )
        except psycopg.Error: 
            print("Database connection failed!")
            raise
        
    def add_exam(self, id_exam, id_subject, name_exam, duration, questions, created):
        with self.connection_database() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    insert into exams (id_exam, id_subject, name_exam, duration, questions, created)
                    values (%s, %s, %s, %s, %s, %s)
                    """
                , (id_exam, id_subject, name_exam, duration, json.dumps(questions), created,))
                conn.commit()
                return id_exam
        
        
    def get_list_exam(self):
        with self.connection_database() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    select id_exam, name_subject, name_exam, duration, created
                    from exams
                    inner join subjects on exams.id_subject = subjects.id_subject
                    """
                , ())
                return cur.fetchall()
            
    def get_info_exam(self, id_exam):
        with self.connection_database() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    select id_exam, name_subject, name_exam, duration, created
                    from exams
                    inner join subjects on exams.id_subject = subjects.id_subject
                    where id_exam=%s
                    """
                , (id_exam,))
                return cur.fetchone()