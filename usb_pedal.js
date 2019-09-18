/*
  Working from home office, I have meetings where I need to take notes on my
  loud keyboard while interacting heavily with eg. a customer. Tapping the 
  mute button on Touch 10 is a bit cumbersome, but with the launch of USB keyboard
  support on CE, a simple USB pedal can do the trick!
  
  I did a lot of fiddling with keeping state etc (I'm by far a JavaScript guru, 
  so most of this is copy/paste/tweak/trial&error-based), I was very happy
  when I found the xAPI has a "ToggleMute" command :)

  henrikba@cisco.com, 2019-09-18
*/

const xapi = require('xapi');

function com(command) {
  xapi.command(command);
}

function log(event) {
  console.log(event);
}

function notify(message) {
  xapi.command('UserInterface Message TextLine Display', {
    Text: message,
    duration: 3
  });
}

function init() {
  xapi.event.on('UserInterface InputDevice Key Action', press => {
    if (press.Type == "Pressed") {
      switch (press.Key) {
            default:
            break;
        }
    } else if (press.Type == "Released") {
        switch (press.Key) {
          case 'KEY_B':
            com('Audio Microphones ToggleMute');
            break;
          default:
            notify(press.Key + ' is not bound!');
            break;
        }
      }
  });
}

init();
