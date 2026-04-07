# Multi-stage builder for Node.js dependencies
FROM node:22-alpine AS web-deps
WORKDIR /web-build
COPY web/package*.json ./
RUN npm ci

# Combined runtime image: Python + Node.js
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install OpenCV runtime deps (for Python)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    NODE_ENV=production

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy Node dependencies from builder
COPY --from=web-deps /web-build/node_modules web/node_modules

# Copy source code
COPY server server
COPY web web

# Build Next.js with API URL (set at image build time)
ARG NEXT_PUBLIC_API_URL=http://localhost:5678
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN cd web && npm run build

# Copy entrypoint
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

EXPOSE 5678 3000

ENTRYPOINT ["/entrypoint.sh"]
