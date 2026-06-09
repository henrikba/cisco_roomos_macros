import xapi from 'xapi';

/*
Silent dial macro for the calling device.

What it does:
- Reacts to a UI Extensions action button with Panel ID "silent_dial".
- Mutes the local microphones before placing the call to avoid echo/howling.
- Sets the camera behavior used for the demo.
- Dials the receiving device over Webex, then mutes again after the dial command.

Required setup:
- Install this macro on the calling device.
- Create a UI Extensions action button on that device with Panel ID "silent_dial",
  or change PANEL_ID below to match your button.
- Set DIAL_TARGET to the receiving device dial string.
- Install auto_answer_specific_caller.js on the receiving device and configure it
  to trust this calling device's caller ID.

To find the dial string or caller ID, make a manual test call and inspect the call
history or macro log on the receiving device. The incoming call event usually shows
the useful values in fields such as RemoteURI.
*/

const PANEL_ID = 'silent_dial';
const DIAL_TARGET = 'ee5ef8a1-74d2-4b1f-a7fe-ad4271f02468';
const DIAL_PROTOCOL = 'Spark';
const CAMERA_BEHAVIOR = 'Desktop';
const LOG_PREFIX = '[silent-dial]';
const TRIGGER_COOLDOWN_MS = 1000;

let isDialing = false;
let lastTriggerAt = 0;

function isConfigured() {
  return DIAL_TARGET !== 'REPLACE_WITH_NUMBER_OR_URI' && DIAL_TARGET.trim() !== '';
}

function isPanelClickEvent(event) {
  return event.PanelId === PANEL_ID;
}

function logError(message, error) {
  console.error(`${LOG_PREFIX} ${message}: ${error.message || error}`);
}

async function setCameraModePortrait() {
  try {
    await xapi.command('Cameras SpeakerTrack Set', { Behavior: CAMERA_BEHAVIOR });
    console.log(`${LOG_PREFIX} Camera mode set to Portrait (${CAMERA_BEHAVIOR}).`);
  } catch (error) {
    logError(`Failed to set camera mode to Portrait (${CAMERA_BEHAVIOR})`, error);
  }
}

async function placeMutedCall() {
  if (!isConfigured()) {
    console.error(`${LOG_PREFIX} Set DIAL_TARGET before enabling this macro.`);
    return;
  }

  if (isDialing) {
    console.log(`${LOG_PREFIX} Dial already in progress, ignoring duplicate press.`);
    return;
  }

  isDialing = true;

  try {
    await xapi.command('Audio Microphones Mute');
    console.log(`${LOG_PREFIX} Local microphones muted before call setup.`);

    await setCameraModePortrait();

    console.log(`${LOG_PREFIX} Dialing ${DIAL_TARGET} using ${DIAL_PROTOCOL}.`);
    await xapi.command('Dial', { Number: DIAL_TARGET, Protocol: DIAL_PROTOCOL });
    await xapi.command('Audio Microphones Mute');
    console.log(`${LOG_PREFIX} Dial command sent.`);
  } catch (error) {
    logError('Failed to place muted call', error);
  } finally {
    isDialing = false;
  }
}

xapi.Event.UserInterface.Extensions.Panel.Clicked.on(event => {
  if (!isPanelClickEvent(event)) {
    return;
  }

  const now = Date.now();
  if (now - lastTriggerAt < TRIGGER_COOLDOWN_MS) {
    return;
  }

  lastTriggerAt = now;
  console.log(`${LOG_PREFIX} Panel ${event.PanelId} clicked.`);
  placeMutedCall();
});
