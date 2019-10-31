from node:latest as build

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN yarn install 
RUN yarn global add react-scripts

RUN yarn build

from nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html