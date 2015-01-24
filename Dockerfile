FROM resin/rpi-nodejs
RUN apt-get -q update && apt-get install -y bluetooth bluez-utils libbluetooth-dev

COPY . /app

CMD ["node" "app/index.js"]