FROM node:22 AS base

FROM base AS builder

#RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .

ENV DATABASE_URL postgresql://neondb_owner:npg_VGstvMy78mpI@ep-damp-frog-a94w5ime-pooler.gwc.azure.neon.tech/neondb?sslmode=require
ENV JWT_SECRET d89f5967c264e3bf22be142835c718ea2a9f4ab79637909cc2f2699960b6cbc942e99bca575ffaeb405e7893b4fb114e14d2050fb4e92907c02afa7212445120

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
