#!/bin/bash

set -o errexit

apt-get -q update
apt-get install -y bluetooth bluez-utils libbluetooth-dev gcc build-essentials