var bleacon = require('bleacon');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var unirest = require('unirest');

// Start listening for iBeacon broadcast (ONLY iPHONE UUID)
bleacon.startScanning('8492e75f4fd6469db132043fe94921d8');

// Store the beacons that are inside
var insideBeacons = [];

// Temporary
var majorMattia = 6517;
var majorSertglu = 10241;

// Discover event
bleacon.on('discover', function(beacon) {

    if (beacon.proximity == 'immediate') {

        // Emit event of a near beacon
        eventEmitter.emit('beaconIsNear', {
            uuid: beacon.uuid,
            major: beacon.major,
            minor: beacon.minor
        });


    } else if (beacon.proximity == 'far') {

        // Emit event of a far beacon
        eventEmitter.emit('beaconIsFar', {
            uuid: beacon.uuid,
            major: beacon.major,
            minor: beacon.minor
        });

    }
});

eventEmitter.on('beaconIsNear', function(beacon) {

    // Start situation, nobody is connected
    if (insideBeacons.length === 0) {

        // Add the beacon to the array of people that is inside
        insideBeacons.push(beacon);

        // TEMP show the name
        if (beacon.major == majorMattia) {
            console.log('Mattia is the first to came in');
        } else if (beacon.major == majorSertglu) {
            console.log('Sertglu is the first to came in');
        }

    }
    // Somebody was already inside since insideBeacons != 0
    else {

        var isIn = false;

        insideBeacons.forEach(function(item) {
            // Check if it wasn't already in
            if (item.major == beacon.major) {
                isIn = true;
            }
        });

        if (!isIn) {
            insideBeacons.push(beacon);

            // TEMP show the name
            if (beacon.major == majorMattia) {
                console.log('Mattia just came in');
            } else if (beacon.major == majorSertglu) {
                console.log('Sertglu just came in');
            }
        }
    }
});

function checkInside(beacon) {
    insideBeacons.forEach(function(item) {

        // Check if it wasn't already in
        if (item.major !== beacon.major) {

            insideBeacons.push(beacon);

            // TEMP show the name
            if (beacon.major == majorMattia) {
                console.log('Mattia just came in');
            } else if (beacon.major == majorSertglu) {
                console.log('Sertglu just came in');
            }

        }
    });
}

eventEmitter.on('beaconIsFar', function(beacon) {

    insideBeacons.forEach(function(insideBeacon) {

        if (insideBeacon.major == beacon.major && insideBeacon.minor == beacon.minor) {
            var index = insideBeacons.indexOf(insideBeacon);
            if (index > -1) {
                insideBeacons.splice(index, 1);
            }
            if (beacon.major == majorMattia) {
                console.log('BYE Mattia');
            } else if (beacon.major == majorSertglu) {
                console.log('BYE Sertglu');
            }
        }
    });
});
