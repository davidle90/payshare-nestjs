# ---- Stage 1: Build ----
FROM node:20-slim AS builder
WORKDIR /app

# Copy root-level config
COPY package.json package-lock.json nest-cli.json tsconfig*.json ./

# Copy full monorepo
COPY . .

# Install all dependencies
RUN npm install

# Build only the API
RUN npm run build


# ---- Stage 2: Production ----
FROM node:20-slim
WORKDIR /app

# Copy prod dependencies only
COPY package.json ./
RUN npm install --omit=dev

# Copy built files
COPY --from=builder /app/dist /app/dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/src/main.js"]
