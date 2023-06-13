import xapi from 'xapi';

//pips can happen in active speaker in "Floating" (soon fixed), minimized presentation and selfview.
//xCommand Video ActiveSpeakerPIP Set Position:
//xCommand Video PresentationPIP Set Position:
//xCommand Video Selfview Set PIPPosition:
//all share valuespace: <CenterLeft, CenterRight, LowerLeft, LowerRight, UpperCenter, UpperLeft, UpperRight, DockLowerLeft, DockCenterLeft>

//quick-fix, just do all every time...
async function setPosition(position) {
  try {
    await xapi.Command.Video.ActiveSpeakerPIP.Set({ Position: position});
    await xapi.Command.Video.PresentationPIP.Set({ Position: position});
    await xapi.Command.Video.Selfview.Set({ PIPPosition: position});
  } catch (error) {
    console.error(error);
  }
}

xapi.Event.UserInterface.Extensions.Widget.Action.on((event) => {
  if (event.Type !== 'pressed') {
    return;
  }

  let newPosition = event.Value;
  setPosition(newPosition);

});

/* required panel:
<Extensions>
  <Version>1.10</Version>
  <Panel>
    <Order>1</Order>
    <PanelId>panel_1</PanelId>
    <Origin>local</Origin>
    <Location>CallControls</Location>
    <Icon>Sliders</Icon>
    <Name>Layout Control</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>Layout control</Name>
      <Row>
        <Name/>
        <Widget>
          <WidgetId>ActiveSpeakerPIP_Position</WidgetId>
          <Type>GroupButton</Type>
          <Options>size=4;columns=3</Options>
          <ValueSpace>
            <Value>
              <Key>UpperLeft</Key>
              <Name>Top Left</Name>
            </Value>
            <Value>
              <Key>UpperCenter</Key>
              <Name>Top Center</Name>
            </Value>
            <Value>
              <Key>UpperRight</Key>
              <Name>Top Right</Name>
            </Value>
            <Value>
              <Key>CenterLeft</Key>
              <Name>Mid Left</Name>
            </Value>
            <Value>
              <Key>UpperCenter</Key>
              <Name/>
            </Value>
            <Value>
              <Key>CenterRight</Key>
              <Name>Mid Right</Name>
            </Value>
            <Value>
              <Key>LowerLeft</Key>
              <Name>Bottom Left</Name>
            </Value>
            <Value>
              <Key>UpperCenter</Key>
              <Name/>
            </Value>
            <Value>
              <Key>LowerRight</Key>
              <Name>Bottom Right</Name>
            </Value>
          </ValueSpace>
        </Widget>
      </Row>
      <Options>hideRowNames=1</Options>
    </Page>
  </Panel>
</Extensions>
*/
