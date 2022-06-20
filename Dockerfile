# Build static files
FROM registry.access.redhat.com/ubi8/nodejs-16 as builder

USER root

COPY . .

RUN npm install --global yarn
RUN yarn
RUN yarn lint
RUN yarn test
RUN yarn build

# Deploy web server
FROM registry.access.redhat.com/ubi8/nginx-118

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app-root/src/dist /usr/share/nginx/html
COPY ./app.info.json /usr/share/nginx/html/app.info.json

ADD nginx.conf "${NGINX_CONF_PATH}"
ADD *.conf "${NGINX_DEFAULT_CONF_PATH}"
ADD *.conf "${NGINX_CONFIGURATION_PATH}"

CMD nginx -g "daemon off;"