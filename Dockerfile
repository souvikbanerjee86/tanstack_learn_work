# Stage 1: Build stage
FROM node:20-slim AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy dependency manifests and Prisma files
COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

# Install build dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client (uses placeholder DATABASE_URL for build phase)
# ENV DATABASE_URL="postgresql://placeholder:5432/placeholder"
# RUN pnpm prisma generate

# Copy the rest of the application files
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Production dependencies stage
FROM node:20-slim AS prod-deps

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy dependency manifests and Prisma files
COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma Client for production runtime
# ENV DATABASE_URL="postgresql://placeholder:5432/placeholder"
# RUN pnpm prisma generate

# Stage 3: Final runner stage
FROM node:20-slim AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
ENV NITRO_HOST=0.0.0.0

# Copy built application output from builder stage
COPY --from=builder /app/.output ./.output

# Copy production node_modules from prod-deps stage
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000 (Cloud Run will override this with PORT env var, but good practice)
EXPOSE 8080

# Start the application
CMD ["node", ".output/server/index.mjs"]
