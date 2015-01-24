#!/bin/bash

set -o errexit

apt-get update 
apt-get install -y libbluetooth-dev bluetooth bluez-utils bluez usbutils