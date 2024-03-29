FROM node:16.16 AS build-step

RUN mkdir -p /usr/src/secretary-manager/frontend
RUN chown -R node /usr/src/secretary-manager/frontend

USER node

WORKDIR /usr/src/secretary-manager/frontend

COPY ./src ./src
COPY package.json yarn.lock ./
COPY ./public ./public

RUN yarn install
RUN yarn global add react-scripts
RUN yarn build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build-step /usr/src/secretary-manager/frontend/build/ /usr/share/nginx/html/
