FROM node:lts-alpine

WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn install

COPY . .

ENV PATH /app/node_modules/.bin:$PATH

RUN yarn build

RUN npm prune --production

CMD ["yarn", "start"]