FROM node:22 AS base

FROM base AS builder

#RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .

ENV DATABASE_URL postgres://postgres:vC7vqhqq4cZTev3hF48spvE3hZakDVBaTfQBQc8qg1FPXFwlkIIxozlzaZzdyEW9@157.245.62.184:5433/postgres
ENV JWT_SECRET lms2024@secret

RUN npm ci && \
	npx prisma generate && \
	npx tsc --build tsconfig.json && \
	npm prune --production

FROM base AS runner
WORKDIR /app

RUN mkdir -p /app/dist/uploads

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono


COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/uploads /app/uploads
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=hono:nodejs /app /app

USER hono
EXPOSE 3001

CMD ["node", "/app/dist/index.js"]
