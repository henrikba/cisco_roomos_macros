# RoomOS one-button point-to-point 1080p60 demo

These two RoomOS macros automate a point-to-point device demo that otherwise takes a pile of taps: place the call, mute both sides to avoid echo/howling, set camera behavior, and accept the call on the far end.

The intended flow is:

- Calling device: press a custom UI button with Panel ID `silent_dial`.
- Calling device macro: mute microphone, set camera mode, dial the receiving device, mute again.
- Receiving device macro: accept the expected incoming caller, set camera mode, mute microphone after the call connects.

The macros are intentionally small and demo-focused. They do not force media resolution or call quality; they only automate the setup that lets the devices negotiate the best point-to-point media they can.

## Files

- `silent_dial.js`: install on the calling device.
- `auto_answer_specific_caller.js`: install on the receiving device.

## Setup

1. Install `auto_answer_specific_caller.js` on the receiving device.
2. Install `silent_dial.js` on the calling device.
3. On the calling device, create a UI Extensions action button with Panel ID `silent_dial`.
   - The visible button name can be anything useful, for example `Silent Dial`.
   - The Panel ID must match `PANEL_ID` in `silent_dial.js`.
4. Find the receiving device dial string.
   - Make a normal/manual call between the two devices.
   - On the receiving device, inspect call history or the macro log after the call attempt.
   - Look for the remote URI, callback number, or similar call-history value.
5. Set `DIAL_TARGET` in `silent_dial.js` to the receiving device dial string.
   - For Webex device-to-device dialing, the macro uses `DIAL_PROTOCOL = 'Spark'`.
   - With `Protocol: 'Spark'`, a Webex UUID-style target can usually be used without adding a `spark:` prefix.
6. Find the calling device caller ID.
   - Make a manual test call from the calling device to the receiving device.
   - On the receiving device, inspect call history or the `IncomingCallIndication` log from `auto_answer_specific_caller.js`.
   - Copy the useful remote caller value, typically from `RemoteURI`.
7. Add that caller ID to `AUTOANSWER_CALLER_IDS` in `auto_answer_specific_caller.js`.
   - The macro strips prefixes such as `sip:`, `h323:`, `spark:`, `webex:`, and `locus:` before matching.
8. Enable both macros and press the calling device button.

## Expected outcome

After setup, one button on the calling device starts the point-to-point demo. The receiving device answers only the configured caller, both sides mute their microphones, and both sides apply the configured camera behavior.

Because the receiving macro auto-answers calls, keep `AUTOANSWER_CALLER_IDS` narrow. For public or shared rooms, disable the macro after the demo or remove caller IDs that should no longer be trusted.

## Required configuration

In `silent_dial.js`:

- `PANEL_ID`: must match the UI Extensions action button Panel ID. Default: `silent_dial`.
- `DIAL_TARGET`: the receiving device dial string.
- `DIAL_PROTOCOL`: the dialing protocol. Default: `Spark` for Webex infrastructure calls.
- `CAMERA_BEHAVIOR`: the xAPI camera behavior used for the demo. Default: `Desktop`.

In `auto_answer_specific_caller.js`:

- `AUTOANSWER_CALLER_IDS`: allowlist of caller IDs that should be auto-answered.
- `setCameraModeDesktop()`: contains the receiving device camera behavior command. Keep as-is if `Desktop` is the desired behavior on your device.

## 1080p60 demo notes

Field note as of 2026-06-06: 1080p60 is available in all RoomOS software channels, and it is usually not disabled. This repo does not check or enforce that state.

Things that may prevent the demo from reaching 1080p60:

- Background blur or background replacement.
- Using the wide camera, whether manually selected, selected by camera intelligence such as Frames, or selected through similar camera behavior.
- Adding Webex App participants into the call path. The intended demo is pure device-to-device.
- Bandwidth policies, network conditions, or device configuration limiting call rate or media quality.

For a clean demo, use two RoomOS devices in a direct point-to-point call. The sending device must support 60 fps, preferably a Desk Pro G2. Avoid background effects, avoid wide-camera/framing modes, and make sure the devices have enough bandwidth headroom.

## Useful Cisco/Webex references

- RoomOS macro tutorial: https://roomos.cisco.com/doc/TechDocs/MacroTutorial
- UI Extensions Panel Clicked event: https://roomos.cisco.com/xapi/Event.UserInterface.Extensions.Panel.Clicked/?search=Panel
- UI Extensions Panel Save command: https://roomos.cisco.com/xapi/Command.UserInterface.Extensions.Panel.Save/
- Dial command and `Protocol: Spark`: https://roomos.cisco.com/xapi/Command.Dial/?search=bookings
- RoomOS software channels and upgrades: https://help.webex.com/en-us/article/idba5c/Upgrade-softwaru-RoomOS
- Bandwidth management for Board, Desk, and Room Series: https://help.webex.com/article/51qu5cb/Bandwidth-management-for-Board%2C-Desk%2C-and-Room-Series
