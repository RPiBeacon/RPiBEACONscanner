# RPiBeacon Scanner
RaspberryPi beacon scanner allows you to scan for iBeacon broadcasting.

### What you need?

* Raspberry-Pi
* Bluetooth 4.0 module (BLE)
* A compatible iBeacon (Estimote for example)

### Prerequisites

* Node.js
```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
# Check installation
node -v
```
* Linux Bluetooth stack  
```
sudo apt-get update && sudo apt-get install -y usbutils bluetooth bluez bluez-utils libbluetooth-dev 
```

### Installation
* `git clone https://github.com/RPiBeacon/RPiBEACONscanner.git`
* `npm install`
* You need to setup an ENV var for the location `sudo nano ~.profile` and add this at the end
```
RPI_LOCATION=1; export RPI_LOCATION
```

### Run
You need to start the script with root permission in order to use the bluetooth so always use `sudo node index.js` or `npm start`