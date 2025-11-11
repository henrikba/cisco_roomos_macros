# cisco_roomos_macros
These are either macros I'm using on my Cisco Room Kit/Cisco Desk Pro in the office/home office, or samples/playing around. Mostly to have a backup, but also to share my usecases.

## USB_mic_toggler
Make it easier to use a USB headset with Desk series, while using the (usually much better) internal microphone for audio pickup. Allow temporarily override to built-in mic in headset (especially when there are loud voices nearby), while resetting it after each call.

## mediastatistics_toggler
"Stats for nerds" function, for easier access to toggle the media statistics overlay on/off.

## pip_layout_control
When a "part" of the call is in a smaller window (Picture-in-picture, aka "PIP"), you might want to move the PIP around to not cover important parts of the video. This is easy on touch-enabled devices, but tricker via the Navigator. RoomOS 11 allows moving the self view, but not yet the minimized presentation or the floating call on top of presentation in the "Floating" layout. This is a quick-n-dirty fix for this issue :)

## proximity_toggler
This makes it easier to toggle ultrasound pairing on/off for devices. Very handy if you have multiple devices in a space, and want a more robust pairing on *one* of the devices (eg turn off the ultrasound playback on other devices). Leverages a new xConfig specifically for this. 
**Note:** It's better to use this new API vs. the old method by reducing the Ultrasound MaxVolume. The latter caused a diagnostics warning and a lot of notifications listed in Control Hub.

## slidelayout_automator
Using a (single screen) room device next to a laptop with a Webex Teams client, you can easily optimize the layout, offloading the content to the client to spend more screen real estate on the video call.
This code monitors presentation start, and will automatically minimize incoming presentation once started (by a far end user).

## ultrasoundvolume_macro and ultrasoundvolume_panel
Makes a user interface on Touch 10 to control the volume of the ultrasound token playback. Use with caution, only in controlled demo environments. Read notes in script.

## usb_pedal
I work a fair bit from home, and have meetings where I need to take notes on my loud keyboard while interacting heavily with eg. a customer. Tapping the mute button on Touch 10 is a bit cumbersome (fingers need to leave keyboard), but with the launch of USB keyboard support on CE, a simple USB pedal can do the trick! (banggood, dx, ebay etc; "USB Foot Switch Pedal" - 10-15 USD)
