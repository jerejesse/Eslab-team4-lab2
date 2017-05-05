
// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic climate example logs a stream
of temperature and humidity to the console.
*********************************************/

var tessel = require('tessel');
var climatelib = require('climate-si7020');
var path = require('path');
var av = require('tessel-av');

var climate = climatelib.use(tessel.port['A']);

var mp3 = path.join(__dirname, 'toocold.mp3');
var toocold = new av.Speaker(mp3);
mp3 = path.join(__dirname,'toohot.mp3');
var toohot = new av.Speaker(mp3);

climate.on('ready', function () {
  console.log('Connected to climate module');

  // Loop forever
  setImmediate(function loop () {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
      console.log('Degrees:', ((temp.toFixed(4)-32)/1.8)+'C', 'Humidity:', humid.toFixed(4) + '%RH');
      if(((temp.toFixed(4)-32)/1.8)>30){
        toohot.play();
      }else if(((temp.toFixed(4)-32)/1.8)<29){
        toocold.play();
      }

      setTimeout(loop, 300);
      });
    });
  });
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});

/*sound.play();

/sound.on('ended', function(seconds) {
  sound.play();
});*/
