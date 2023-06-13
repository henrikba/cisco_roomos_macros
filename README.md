# cisco_roomos_macros
These are either macros I'm using on my Cisco Room Kit in the home office, or samples/playing around. Mostly to have a backup, but also to share my usecases.

## pip_layout_control.js
When a "part" of the call is in a smaller window (Picture-in-picture, aka "PIP"), you might want to move the PIP around to not cover important parts of the video. This is easy on touch-enabled devices, but tricker via the Navigator. RoomOS 11 allows moving the self view, but not yet the minimized presentation or the floating call on top of presentation in the "Floating" layout. This is a quick-n-dirty fix for this issue :)

## slidelayout_automator
Using a (single screen) room device next to a laptop with a Webex Teams client, you can easily optimize the layout, offloading the content to the client to spend more screen real estate on the video call.
This code monitors presentation start, and will automatically minimize incoming presentation once started (by a far end user).

## ultrasoundvolume_macro and ultrasoundvolume_panel
Makes a user interface on Touch 10 to control the volume of the ultrasound token playback. Use with caution, only in controlled demo environments. Read notes in script.

## usb_pedal
I work a fair bit from home, and have meetings where I need to take notes on my loud keyboard while interacting heavily with eg. a customer. Tapping the mute button on Touch 10 is a bit cumbersome (fingers need to leave keyboard), but with the launch of USB keyboard support on CE, a simple USB pedal can do the trick! (banggood, dx, ebay etc; "USB Foot Switch Pedal" - 10-15 USD)
