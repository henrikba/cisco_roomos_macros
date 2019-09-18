/*
  Using a (single screen) room device next to a laptop with a Webex Teams client, you can
  easily optimize the layout, offloading the content to the client to spend more screen
  real estate on the video call.

  This code monitors presentation start, and will automatically minimize incoming presentation
  once started (by a far end user).

  henrikba@cisco.com, 2018-12-17
*/


const xapi = require('xapi');

/*
// Connect over ssh to a codec (when using jsxapi only)
const xapi = jsxapi.connect('ssh://sx', {
  username: 'admin',
  password: 'pw',
});
*/

console.log('\nReady to automate layout - listening for incoming presentation...');

xapi.event.on('PresentationStarted', (presostart) => {
  if(presostart.Mode == 'Receiving') {
    console.log('Fixed presentation layout for you,', Date().toString());
    xapi
    .command('Video PresentationView Set', { View: 'Minimized'})
    .catch((error) => { console.error(error); });
  }
});
