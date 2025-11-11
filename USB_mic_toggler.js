import xapi from 'xapi';

// Make it easier to use a USB headset with Desk series, while using the (usually much better) internal microphone for audio. 
// Allow temporarily override to built-in mic in headset, but reset after each call.
// Requires a side panel widget called microphoneMuteToggle, with values "internal" and "USB"
// Create this with UI extensions

// Function to set audio mode
function setAudioMode(mode) {
    let audioMode = (mode === 'internal') ? 'Speaker' : 'SpeakerAndMicrophone';
    xapi.Config.Audio.USB.Mode.set(audioMode);
    //console.log("Set audio usb mode: " + audioMode)
}

// Function to update the toggle button based on current state
function updateToggleButton() {
    xapi.config.get('Audio.USB.Mode')
        .then(value => {
            const widgetValue = (value === 'Speaker') ? 'internal' : 'USB';
            xapi.command('UserInterface Extensions Widget SetValue', {
                WidgetId: 'microphoneModeToggle',
                Value: widgetValue
            });
            //console.log("Updated toggle button to: " + widgetValue);
        })
        .catch(error => console.error("Error getting audio usb mode:", error));
}

// Handle group button changes
xapi.Event.UserInterface.Extensions.Widget.Action.on((event) => {
  if (event.WidgetId === 'microphoneModeToggle') {
    if (event.Type === 'pressed') {
      setAudioMode(event.Value);
    }
  }
});

// Update group button when panel is opened
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    //console.log("tap panel");
    if (event.PanelId === 'audioTogglePanel') {
        updateToggleButton();
    }
});

// Reset audio mode to 'Speaker' when the call disconnects
xapi.Event.CallDisconnect.on(() => {
    setAudioMode('internal');
});
