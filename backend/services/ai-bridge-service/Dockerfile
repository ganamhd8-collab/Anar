# ─────────────────────────────────────────────────────────────────────────────
#  ai-bridge-service — Dockerfile (multi-stage)
#  Stage 1: builder  — installs all deps and compiles TypeScript → dist/
#  Stage 2: runner   — copies only the compiled output and prod deps
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first for better layer caching.
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for tsc).
RUN npm ci

# Copy source and compile.
COPY . .
RUN npm run build


# ── Stage 2: Runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Only install production dependencies in the final image.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output from builder.
COPY --from=builder /app/dist ./dist

# Expose the service port (must match PORT env var).
EXPOSE 3004

# Run as non-root for security.
USER node

CMD ["node", "dist/main"]
