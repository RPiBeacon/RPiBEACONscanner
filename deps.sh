#!/bin/bash

set -o errexit

apt-get -q update 
apt-get install -y libbluetooth-dev bluetooth bluez-utils