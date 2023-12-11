FROM nginx:1.17.3

ADD nginx.conf /etc/nginx/
ADD server.conf /etc/nginx/conf.d/

EXPOSE 80

ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]