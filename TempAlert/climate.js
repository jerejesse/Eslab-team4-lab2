tessel = require('tessel');
climatelib = require('climate-si7020');
climate = climatelib.use(tessel.port['A']);
PubNub = require('pubnub')

var pubnub = new PubNub({
   publish_key: "pub-c-e44b1f01-85de-4fa4-bbdd-9819a27ca3c1",
   subscribe_key: "sub-c-69141b3e-3173-11e7-bb5c-02ee2ddab7fe"
 })
 pubnub.subscribe({
     channels: ['climate-monitor']
 })

climate.on('ready', function() {
    console.log('Connected to climate module: ')
    setImmediate(function loop () {
      climate.readTemperature('f', function (err, temp) {
        climate.readHumidity(function (err, humid) {
            console.log('Degrees:', toCalcius(temp.toFixed(4)) + ' C', 'Humidity:', humid.toFixed(4) + '%RH');
             pubnub.publish({
                 message: {
                     Temperature: toCalcius(temp.toFixed(4)),
                     Humidity: humid.toFixed(4)
                 },
                 channel: 'climate-monitor'
                });
            setTimeout(loop, 300);
        });
      });
    });
})

climate.on('error', function(err) {
  console.log('error connecting module', err);
});

function toCalcius(degree) {
    cal = (degree - 32) * 5 / 9
    return cal.toFixed(4)
};
