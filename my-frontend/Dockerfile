# my-frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Cài pnpm
RUN npm install -g pnpm

# Copy package
COPY package.json pnpm-lock.yaml* ./

# Cài dependencies
RUN pnpm install

# Copy source
COPY . .

# Build (nếu cần)
#RUN pnpm build

# Chạy với pnpm run start
CMD ["pnpm", "run", "start"]
