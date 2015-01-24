FROM resin/rpi-nodejs
RUN apt-get -q update && apt-get install -y libbluetooth-dev
RUN apt-get install -y bluetooth bluez-utils

COPY . /app

CMD ["node" "app/index.js"]