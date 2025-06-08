FROM node:20
WORKDIR /app
COPY upstreamMock.js .
RUN npm init -y && npm install express
CMD ["node", "upstreamMock.js"]
