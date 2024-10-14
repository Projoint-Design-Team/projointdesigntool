# Use a multi-stage build to keep the final image as small as possible
# Build stage
FROM node:alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:alpine
WORKDIR /app
#COPY --from=builder /app/.env.production ./ (uncomment this line when you create ".env.production" file with environment variables )
COPY --from=builder /app/.env.local ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
CMD ["npm", "start"]
