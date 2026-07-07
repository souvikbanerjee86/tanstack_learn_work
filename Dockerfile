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

# Pass build-time environment variables for Vite/Firebase client-side configuration
ARG VITE_FIREBASE_API_KEY="AIzaSyBmsSuXNYdUWIafuokHXVjY9fL6SyVGe_Q"
ARG VITE_FIREBASE_AUTH_DOMAIN="project-a1d8640b-7060-47f8-929.firebaseapp.com"
ARG VITE_FIREBASE_PROJECT_ID="project-a1d8640b-7060-47f8-929"
ARG VITE_FIREBASE_STORAGE_BUCKET="project-a1d8640b-7060-47f8-929.firebasestorage.app"
ARG VITE_FIREBASE_MESSAGING_SENDER_ID="1081651239029"
ARG VITE_FIREBASE_APP_ID="1:1081651239029:web:4a5c0887419af53276403c"
ARG VITE_FIREBASE_MEASUREMENT_ID="G-55SGBBM0ZN"

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

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
