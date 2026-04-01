FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./package.json
RUN npm install --omit=dev

COPY backend/src ./src

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "start"]

