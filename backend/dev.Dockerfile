FROM python:3

WORKDIR /usr/src/secretary-manager/backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd secretary_manager
RUN chown -R secretary_manager /usr/src/secretary-manager/backend

USER secretary_manager

ENV PYTHONUNBUFFERED 0

EXPOSE 5000

CMD ["sh", "start.sh"]