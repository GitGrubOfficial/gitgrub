FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
COPY .env .env

RUN npm install

COPY . .

# Build the frontend (optional for production)
# RUN npm run build


EXPOSE 3000

# Start React app
CMD ["npm", "start"]
