FROM python:3.12

WORKDIR /backend

COPY . .

RUN pip install --no-cache-dir -r requirements_freeze.txt

EXPOSE 6789

CMD [ "uvicorn", "main:app", "--host=0.0.0.0", "--port=6789" ]