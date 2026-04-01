FROM node:20-bookworm-slim AS runtime

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY media ./media

CMD ["node", "src/app.js"]
