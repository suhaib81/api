FROM node:6.9.2-onbuild



RUN npm install -g node-gyp
RUN npm install bcrypt

EXPOSE 4050