import xapi from 'xapi';

// Define a unique ID for the UI panel
const PANEL_ID = 'proximity_toggler';

/**
 * Asynchronously retrieves the current Webex Proximity Mode configuration.
 * @returns {string|null} 'On', 'Off', or null if an error occurs.
 */
async function getProximityMode() {
  try {
    const mode = await xapi.config.get('Webex Proximity Mode');
    return mode;
  } catch (e) {
    console.error('Error getting Webex Proximity Mode:', e);
    return null;
  }
}

/**
 * Asynchronously sets the Webex Proximity Mode configuration.
 * @param {string} mode - The desired mode ('On' or 'Off').
 * @returns {boolean} True if successful, false otherwise.
 */
async function setProximityMode(mode) {
  try {
    await xapi.config.set('Webex Proximity Mode', mode);
    console.log(`Webex Proximity Mode set to: ${mode}`);
    return true;
  } catch (e) {
    console.error(`Error setting Webex Proximity Mode to ${mode}:`, e);
    return false;
  }
}

/**
 * Updates or creates the UI extension button based on the current Proximity Mode.
 * @param {string} currentMode - The current Webex Proximity Mode ('On' or 'Off').
 */
async function updateUIButton(currentMode) {
  const buttonName = (currentMode === 'On') ? 'Disable Proximity' : 'Enable Proximity';
  const iconName = 'Proximity';

  const panelXml = `
    <Extensions>
      <Version>1.11</Version>
      <Panel>
        <Order>1</Order>
        <PanelId>${PANEL_ID}</PanelId>
        <Location>ControlPanel</Location>
        <Icon>${iconName}</Icon>
        <Name>${buttonName}</Name>
        <ActivityType>Custom</ActivityType>
      </Panel>
    </Extensions>`.replace(/\s+/g, ' ').trim();

  try {
    await xapi.command('UserInterface Extensions Panel Save', { PanelId: PANEL_ID }, panelXml);
    console.log(`UI button updated. Text: "${buttonName}" (Current Mode: ${currentMode})`);
  } catch (e) {
    console.error('Error saving UI extension panel:', e);
  }
}

/**
 * Toggles the Webex Proximity Mode between 'On' and 'Off'.
 */
async function toggleProximityMode() {
  const currentMode = await getProximityMode();
  if (currentMode === null) {
    console.error('Could not determine current Proximity Mode. Aborting toggle.');
    return;
  }

  const newMode = (currentMode === 'On') ? 'Off' : 'On';
  await setProximityMode(newMode);
  // The configuration listener below will automatically handle updating the UI.
}

/**
 * Initializes the macro.
 */
async function init() {
  // Good practice: remove the panel on start to prevent orphans.
  await xapi.command('UserInterface Extensions Panel Remove', { PanelId: PANEL_ID }).catch(() => { /* Ignore error if panel doesn't exist */ });

  console.log('Proximity Mode Toggle Macro started.');

  // Set the initial state of the button
  const initialMode = await getProximityMode();
  if (initialMode !== null) {
    await updateUIButton(initialMode);
  } else {
    console.error('Failed to get initial Proximity Mode. UI button may not be correct.');
  }

  // Listen for clicks on our specific panel
  xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    if (event.PanelId === PANEL_ID) {
      console.log('Proximity toggle panel clicked!');
      toggleProximityMode();
    }
  });

  // Listen for changes on the configuration path itself.
  // This makes the button update even if an admin changes the setting elsewhere.
  xapi.config.on('Webex Proximity Mode', (mode) => {
    console.log(`Proximity Mode config changed to: ${mode}. Updating UI.`);
    updateUIButton(mode);
  });
}

// Start the macro
init();
