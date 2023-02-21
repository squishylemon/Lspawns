// Network handler to receive death blip information from the server
addNetworkHandler("deathBlip", function(client, blipID) {
   
  let tmpBlip = null;


  if (gta.game == GAME_GTA_III) {
    tmpBlip = GTA3DeathBlip;
  } else if (gta.game == GAME_GTA_VC) {
    tmpBlip = GTAVCDeathBlip;
  }

    let dpos = localPlayer.position;
    let blip = gta.createBlip(dpos, tmpBlip, BlipSize, 0);

    if (blip) {
      setTimeout(function() {
        gta.destroyElement(blip);
      }, BlipFadeTime * 1000);
    }
  });
  