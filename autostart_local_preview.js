import xapi from 'xapi';

// For Cisco Desk Pro using HDMI out (dual screen setup), this automates so you won't loose compute on second screen
// Suggested setup: Laptop USB-C -> Desk Pro. Desk Pro HDMI -> external screen (4K 16:9). 
// Sit in front of external screen/use & configure as main monitor.
// Set Desk Pro to the side. Now in call, by default you keep your work available.
// You can still share in call and see everyone you talk to (get visual queues).
// You can opt to get incoming presentation on second screen, or keep it single-screen on Desk Pro.

const sleep = ms => new Promise(res => setTimeout(res, ms))

async function startLocalPreview() {
  await sleep(1000)

  // Start the local preview of the connected USB-C source
 try {
   await xapi.Command.Presentation.Start({
      ConnectorId: '2',
      SendingMode: 'LocalOnly',
    })
    console.log("Local preview of USB-C source started.")
  }
  catch(e) {
   console.error("Failed to start local preview of USB-C source:", error);
  }
}

// Listen for the call start event
xapi.Event.CallSuccessful.on(() => {
  startLocalPreview();
});
