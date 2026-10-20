FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx expo export -p web

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./public/manifest.json /usr/share/nginx/html/manifest.json
COPY ./public/sw.js /usr/share/nginx/html/sw.js

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
