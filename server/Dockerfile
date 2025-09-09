FROM node:20-alpine
WORKDIR /app

# Install only production deps for faster, smaller images
COPY package*.json ./
RUN npm ci --omit=dev || npm i --omit=dev

# Copy source
COPY . .

# Expose internal port + start
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node","index.js"]
