# ─────────────────────────────────────────────────────────────────────────────
#  notification-service — Dockerfile (multi-stage)
#  Stage 1: builder  — installs all deps and compiles TypeScript → dist/
#  Stage 2: runner   — copies only the compiled output and prod deps
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first for better layer caching.
COPY package*.json ./

# Install ALL dependencies (devDependencies needed for tsc / nest build).
RUN npm install

# Copy source files and compile TypeScript → dist/
COPY . .
RUN npm run build


# ── Stage 2: Runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Only production dependencies in the final image — keeps it lean.
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output from builder stage.
COPY --from=builder /app/dist ./dist

# notification-service runs on port 3002 (matches PORT in .env).
EXPOSE 3002

# Run as non-root user for security.
USER node

CMD ["node", "dist/main"]