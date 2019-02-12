FROM motionnode:1.0
RUN mkdir /usr/src/node-red/hdmapp
COPY . /usr/src/node-red/hdmapp
RUN npm install /usr/src/node-red/hdmapp