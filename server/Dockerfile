FROM node:20-alpine
WORKDIR /app

# Install only production deps for faster, smaller images
COPY package*.json ./
RUN npm ci --only=production || npm i --only=production

# Copy source
COPY . .

# Expose internal port + start
ENV PORT=3000
EXPOSE 3000
CMD ["node","index.js"]
