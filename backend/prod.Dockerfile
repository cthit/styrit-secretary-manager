FROM python:3-alpine

RUN apk update && apk add postgresql-bdr-client postgresql-dev build-base shadow

WORKDIR /usr/src/secretary-manager/backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN apk del build-base postgresql-dev

RUN useradd secretary_manager

COPY . .

RUN chown -R secretary_manager /usr/src/secretary-manager/backend

USER secretary_manager

ENV FLASK_ENV production

EXPOSE 5000

CMD ["sh", "start.sh"]
