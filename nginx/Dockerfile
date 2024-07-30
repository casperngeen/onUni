FROM nginx:mainline-alpine
# to store .template files -> will transform .template to .conf.d file for the actual nginx config
WORKDIR /etc/nginx/templates
COPY default.conf.template /etc/nginx/templates/default.conf.template

