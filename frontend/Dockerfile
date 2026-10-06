FROM node:22-alpine AS build

WORKDIR /app/frontend

# frontend/.env в .gitignore и в CI отсутствует,
# поэтому адрес API передаём явно (через nginx на 80 порту)
ARG VITE_API_ORIGIN=http://localhost/api
ENV VITE_API_ORIGIN=$VITE_API_ORIGIN

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]