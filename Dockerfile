FROM mcr.microsoft.com/playwright:v1.43-jammy

RUN apt-get update && apt-get install -y xvfb

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x start.sh

CMD ["./start.sh"]
