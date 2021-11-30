FROM node:16.13

RUN mkdir -p /usr/src/secretary-manager/frontend
RUN chown -R node /usr/src/secretary-manager/frontend

USER node

WORKDIR /usr/src/secretary-manager/frontend

COPY ./src/ .
COPY package.json .
COPY ./public/ .
COPY .env.development .env

RUN yarn install
RUN yarn global add react-scripts

EXPOSE 3000

CMD yarn start
