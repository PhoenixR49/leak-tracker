ARG NODE_VERSION=20.11.0

FROM node:${NODE_VERSION}-alpine as base

ADD . /app/
WORKDIR /app
RUN npm run build

ENV APP_NAME="LEAK Tracker"
ENV EMAIL_HOST="smtp.example.com"
ENV EMAIL_PORT="465"
ENV EMAIL_USER="alert@example.com"
ENV EMAIL_PASSWORD="very_cool_password"
ENV PORT=8080

EXPOSE ${PORT}

CMD npm run start