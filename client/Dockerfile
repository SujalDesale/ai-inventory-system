# Simple dev Dockerfile using Vite dev server
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --legacy-peer-deps || true
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
