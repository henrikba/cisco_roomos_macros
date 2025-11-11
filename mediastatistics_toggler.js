import xapi from 'xapi';

// Side panel button to toggle media statistics on and off ("stats for nerds")
// Requires a panel, named as in const below

// Panel ID for the custom button
const PANEL_ID = 'toggleMediaStats';

// Toggle the statistics overlay
async function toggleStats() {
  const currentState = await xapi.Config.Conference.Diagnostics.StreamStatusOverlay.get();
  const newState = currentState === 'On' ? 'Off' : 'On';
  
  await xapi.Config.Conference.Diagnostics.StreamStatusOverlay.set(newState);
  
  // console.log(`Statistics overlay set to: ${newState}`);
}


// Initialize the macro
async function init() {
  try {
    // Set initial button color based on current stats state
    const currentState = await xapi.Config.Conference.Diagnostics.StreamStatusOverlay.get();
    
    // Register event handler for button presses
    xapi.Event.UserInterface.Extensions.Panel.Clicked.on((event) => {
      if (event.PanelId === PANEL_ID) {
        toggleStats();
      }
    });
    
    // console.log('Media stats toggle macro initialized');
  } catch (error) {
    console.error('Error initializing macro:', error.message);
  }
}

// Start the macro
init();
