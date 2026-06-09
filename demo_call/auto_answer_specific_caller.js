import xapi from 'xapi';

/*
Auto-answer macro for the receiving device.

What it does:
- Watches incoming calls and accepts only caller IDs listed in
  AUTOANSWER_CALLER_IDS.
- Sets the camera behavior used for the demo.
- Mutes the local microphones once the accepted call is connected.

Required setup:
- Install this macro on the receiving device.
- Add the calling device's caller ID to AUTOANSWER_CALLER_IDS.
- Keep the caller ID value without sip:, h323:, spark:, webex:, or similar
  prefixes. The macro normalises those prefixes before matching.
- Adjust the camera behavior in setCameraModeDesktop() only if your device needs
  a different xAPI value.

To find the caller ID, make a manual test call from the calling device to this
device. Then inspect this device's call history or the macro log; the incoming
call event usually shows the useful value in RemoteURI.

Based on Cisco's "Conditional Autoanswer with Prompt" sample:
https://roomos.cisco.com/macros/Conditional%20Autoanswer%20with%20Prompt
*/

const AUTOANSWER_CALLER_IDS = [
  '105382b9-5ec5-43e5-bd1c-6d70f9110f5a',
];

const LOG_PREFIX = '[auto-answer-specific-caller]';

let autoAnsweredCallId = null;

function normaliseRemoteURI(number) {
  const regex = /^(sip:|h323:|spark:|h320:|webex:|locus:)/gi;
  return String(number || '').replace(regex, '').toLowerCase();
}

function callerMatches(event) {
  const callerIds = AUTOANSWER_CALLER_IDS.map(id => id.toLowerCase());
  const remoteURI = normaliseRemoteURI(event.RemoteURI);
  const displayName = normaliseRemoteURI(event.DisplayNameValue);

  return callerIds.some(id => remoteURI === id || remoteURI.indexOf(id) !== -1 || displayName === id);
}

function callAcceptParameters(callId) {
  if (callId === undefined || callId === null || String(callId) === '') {
    return {};
  }

  return { CallId: callId };
}

function muteMicrophones() {
  xapi.command('Audio Microphones Mute').catch(error => {
    console.error(`${LOG_PREFIX} Failed to mute microphones: ${error.message || error}`);
  });
}

function setCameraModeDesktop() {
  xapi.command('Cameras SpeakerTrack Set', { Behavior: 'Desktop' }).catch(error => {
    console.error(`${LOG_PREFIX} Failed to set camera mode to Desktop: ${error.message || error}`);
  });
}

function answerCall(callId) {
  xapi.command('Call Accept', callAcceptParameters(callId))
    .then(() => {
      console.log(`${LOG_PREFIX} Accepted call ${callId}. Waiting for connection before muting.`);
    })
    .catch(error => {
      console.error(`${LOG_PREFIX} Failed to accept call ${callId}: ${error.message || error}`);
    });
}

xapi.event.on('IncomingCallIndication', event => {
  console.log(event);

  if (!callerMatches(event)) {
    return;
  }

  autoAnsweredCallId = event.CallId;
  console.log(`${LOG_PREFIX} Auto-answering incoming call ${autoAnsweredCallId} from ${event.RemoteURI}.`);
  setCameraModeDesktop();
  answerCall(autoAnsweredCallId);
});

xapi.event.on('CallSuccessful', event => {
  if (String(event.CallId) !== String(autoAnsweredCallId)) {
    return;
  }

  console.log(`${LOG_PREFIX} Call ${event.CallId} connected. Muting microphones.`);
  muteMicrophones();
});

xapi.event.on('CallDisconnect', event => {
  if (String(event.CallId) === String(autoAnsweredCallId)) {
    autoAnsweredCallId = null;
  }
});
