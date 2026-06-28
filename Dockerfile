FROM node:20-alpine AS builder

WORKDIR /app

# Backend deps
COPY package*.json ./
RUN npm ci

# Frontend deps
COPY histlingo-web/package*.json ./histlingo-web/
RUN cd histlingo-web && npm ci

# Copy all source
COPY . .

# Build frontend
RUN cd histlingo-web && npm run build

# Generate Prisma client + build backend
RUN npx prisma generate
RUN npm run build

# Copy frontend dist into backend static folder
RUN mkdir -p dist/public && cp -r histlingo-web/dist/. dist/public/

# --- Production image ---
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/@prisma-adapter-pg ./node_modules/@prisma-adapter-pg 2>/dev/null || true
COPY prisma ./prisma
COPY prisma.config.ts ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main"]
