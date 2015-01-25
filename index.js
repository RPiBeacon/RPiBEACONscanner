var bleacon = require('bleacon');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var unirest = require('unirest');
var location = process.env.RPI_LOCATION;

console.log('Started... Discovering iBeacons!');

// Start listening for iBeacon broadcast (ONLY iPHONE UUID)
// bleacon.startScanning(['8492e75f4fd6469db132043fe94921d8', 'd0d3fa86ca7645ec9bd96af47e6df205', 'c262deb68d694b548263c9c244b21e8a'], true);
bleacon.startScanning();

// Store the beacons that are inside
var insideBeacons = [];

// Check if a beacon is already inside
function isAlreadyInside(beacon) {
  var isIn = false;
  insideBeacons.forEach(function(insideBeacon) {
    // Check if it wasn't already in
    if (insideBeacon == beacon.UUID) {
      isIn = true;
    }
    return isIn;
  });
}

// Check the server response TODO something if err
function checkResponse(response) {
    if (response.code === 200) {
      console.log('Okay ', response.code);
    } else {
      console.log('There was an error: ', response.code);
    }
  }
  // Discover event
bleacon.on('discover', function(beacon) {

  // Our UUID is composed by the uuid + major + minor
  var UUID = beacon.uuid + beacon.major.toString() + beacon.minor.toString();

  if (beacon.proximity == 'immediate') {

    // Emit event of a near beacon
    eventEmitter.emit('beaconIsNear', {
      UUID: UUID
    });


  } else if (beacon.proximity == 'far') {

    // Emit event of a far beacon
    eventEmitter.emit('beaconIsFar', {
      UUID: UUID
    });

  }
});

eventEmitter.on('beaconIsNear', function(beacon) {

  // Start situation, nobody is connected
  if (insideBeacons.length === 0) {

    // Add the beacon to the array of people that is inside
    insideBeacons.push(beacon.UUID);

    console.log('Currently we have ', insideBeacons);

    // SEND TO SERVER
    unirest.post('http://modusnova.demo.accris.com/?ServiceHandler=HR&OP=MoveEmployee&UUID=' + beacon.UUID + '&Location=' + location + '&Direction=1')
      .send()
      .end(function(response) {
        checkResponse(response);
      });

  }
  // Somebody was already inside since insideBeacons != 0
  else {

    if (isAlreadyInside(beacon) === false) {

      console.log('Currently we have ', insideBeacons);

      // Add the beacon to the array of people that is inside
      insideBeacons.push(beacon.UUID);

      // SEND TO SERVER
      unirest.post('http://modusnova.demo.accris.com/?ServiceHandler=HR&OP=MoveEmployee&UUID=' + beacon.UUID + '&Location=' + location + '&Direction=1')
        .send()
        .end(function(response) {
          checkResponse(response);
        });
    }
  }
});


eventEmitter.on('beaconIsFar', function(beacon) {

  insideBeacons.forEach(function(insideBeacon) {

    if (insideBeacon == beacon.UUID) {
      var index = insideBeacons.indexOf(insideBeacon);
      if (index > -1) {
        insideBeacons.splice(index, 1);
      }
      console.log('Currently we have ', insideBeacons);

      // SEND TO SERVER
      unirest.post('http://modusnova.demo.accris.com/?ServiceHandler=HR&OP=MoveEmployee&UUID=' + beacon.UUID + '&Location=' + location + '&Direction=0')
        .send()
        .end(function(response) {
          checkResponse(response);
        });
    }
  });
});
