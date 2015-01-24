FROM resin/rpi-nodejs
RUN apt-get -q update && apt-get install -y libbluetooth-dev bluetooth bluez-utils

COPY . /app

CMD ["node" "app/index.js"]