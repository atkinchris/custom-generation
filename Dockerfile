FROM node:9-alpine

RUN apk add --no-cache \
      build-base \
      g++ \
      cairo-dev \
      jpeg-dev \
      pango-dev \
      giflib-dev \
      ttf-freefont \
      ttf-liberation \
      ttf-ubuntu-font-family \
      fontconfig

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --only=production
COPY src ./src

CMD ["npm", "start"]
