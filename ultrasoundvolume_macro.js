/*
  Webex Room devices use ultrasonic tokens to provide a magical device discovery experience.
  In normal meeting rooms, you should never change the ultrasound volume. Since different
  microphones have different sensitivity, it is not possible to tweak the range of pairing
  simply by changing the playback volume. 

  However - some scenarios (for instance in controlled demo environments with multiple 
  devices emitting ultrasound tokens), a volume setting could be useful. It is not
  recommended to use this in scenarios where unaware users will enter a room and pairing
  will appear "flaky" or less robust than the design intention.

  Macro and panel originally from Ragnvald Barth, tweaked a bit. Used for customer demo.

  henrikba@cisco.com, 2019-12-13
*/

const xapi = require('xapi');

const ultrasound_level_slider = 'ultrasound_level_slider';

xapi.event.on('UserInterface Extensions Widget Action', ({Value, WidgetId }) => {
  switch(WidgetId) {
    case ultrasound_level_slider:
      let v = Math.round(Value * 70 / 255);
      xapi.config.set('Audio Ultrasound MaxVolume', v);
      console.log('Audio Ultrasound MaxVolume: ' + v);
      break;
  }
});

xapi.config.get('Audio Ultrasound MaxVolume').then(v => {
    xapi.command('UserInterface Extensions Widget SetValue', {
      WidgetId: ultrasound_level_slider,
      Value: Math.round(v * 255 / 70)
    });
});
