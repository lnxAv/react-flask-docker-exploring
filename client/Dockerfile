FROM node:10.15.2-alpine
RUN mkdir /frontend
WORKDIR /frontend

# Install the application's dependencies into the node_modules's cache directory.
COPY package.json ./
COPY package-lock.json ./
RUN npm install