import psycopg
import os

from dotenv import load_dotenv
from psycopg.rows import dict_row

load_dotenv("./.env")

def connection_database():
    return psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),  
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        row_factory=dict_row
    )