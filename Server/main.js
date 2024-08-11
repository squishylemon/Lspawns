bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
  if (serverGame != GAME_GTA_VC && serverGame != GAME_GTA_III && serverGame != GAME_GTA_SA) {
    LemonConsoleError("The Server is not running either GTA III or Vicecity or San Andreas");
    return;
  }
});

addEventHandler("OnPlayerJoin", function(event, client) {
  if (JoinMessageEnabled) {
	PlayernameChange(client.name);
    messageAllExcept(JoinMessage(), client, JoinMessageColor);
  }
});

addEventHandler("onPlayerQuit", function(event, client, disconnectType) {
  if (DisconnectMessageEnabled) {
	PlayernameChange(client.name);
    messageAllExcept(DisconnectMessage(), client, DisconnectMessageColor);
  }
});


addEventHandler("OnPlayerJoined", (event, client) => {
	
	PlayernameChange(client.name);
	if (ConnectedMessageEnabled) {
	messageAllExcept(ConnectedMessage(), client, ConnectedMessageColor)
	}
	
    let skin = DefaultSkin;
	let spawnLocation;
	
    // If RandomSkin is true, randomly select a skin using the getRandomSkin function
    if (RandomSkin) {
        skin = getRandomSkin();
    }
	
	if (RandomSkinSelective) {
		skin = getRandomListSkin(serverGame);
	}

    // Initialize SpawnPos and SpawnRot variables
    let SpawnPos;
    let SpawnRot = 0;

    // If CustomSpawn is true, set SpawnPos and SpawnRot to the custom spawn coordinates
    if (CustomSpawn == true) {
        SpawnPos = CSpawnCords;
        SpawnRot = CSpawnRot;

    // If serverGame exists in locations, use the getSpawnLocation function to get the SpawnPos and SpawnRot based on the JoinSpawn location ID
    } else if (typeof locations[serverGame] != "undefined") {
		if (!RandomSpawn) {
            spawnLocation = getSpawnLocation(serverGame, JoinSpawn);
		} else {
			spawnLocation = getRandomLocation(serverGame);
		}
        if (spawnLocation) {
            SpawnPos = spawnLocation.pos;
            SpawnRot = spawnLocation.rot;
        } else {
            LemonConsoleError('The locationId was not found');
        }

    // If serverGame does not exist in locations, log an error message
    } else {
        LemonConsoleError('No locations exist for this game');
    }

    // Spawn the player using the calculated SpawnPos and SpawnRot
	
    spawnPlayer(client, SpawnPos, SpawnRot, skin);
	if  (WelcomeMessageEnabled) {
	
	messageClient(WelcomeMessage(), client, WelcomeMessageColor);
	}

    // Fade in the player's camera
    fadeCamera(client, true);
});

addEventHandler("OnPedDeathEx", (event, wastedPed, attackerPed, weapon, pedPiece) => {
  
  if (!wastedPed.isType(ELEMENT_PLAYER)) {
    
    return;
  }
  
  let client = getClientFromPlayerElement(wastedPed);
  let clientid = wastedPed.id;
  let spawnLocation;
  let skin = wastedPed.skin;

  if (DeathBlipsEnabled) {
    
    
    // Get the position of the wasted ped
    const deathPosition = wastedPed.position;
    // Create the blip
    createDeathBlip(client, deathPosition);
    

  }
  
  if (DropWeaponOnDeath) {
    var HeldWeapon = client.weapon;
    if(HeldWeapon != null) {
      var DeathDrop = gta.createPickup(HeldWeapon, client.position, 5)
      DeathDrop.quantity = 1;
      
    }
  }

  if (NearbySpawn) {
    // Spawn within 25-50m of the players death
    let closestpos = getClosestLocation(wastedPed.position);
    spawnLocation = getSpawnLocation(serverGame, closestpos);
  } else if (NearbyDeathSpawn) {
    // Spawn at the closest Spawnpoint (spawn points range from the examples of joinspawns)
    spawnLocation = getOldestPlayerPosition(client);
  } else if (RandomSpawn) {
    // Spawn at the closest Spawnpoint (spawn points range from the examples of joinspawns)
    spawnLocation = getRandomLocation(serverGame);
} else if (CustomDeathSpawn){
    // Spawn at the CustomLocation location
    spawnLocation = setCustomCords();
  } else {
    // Spawn at the JoinSpawn location
    spawnLocation = getSpawnLocation(serverGame, JoinSpawn);
  }

  if (!spawnLocation) {
    LemonConsoleError(`location is wrong (${spawnLocation.pos.x}, ${spawnLocation.pos.y}, ${spawnLocation.pos.z}) ${spawnLocation.rot}`);
    return;
  }

  if (RandomSkinRespawn) {
    skin = getRandomSkin();
  }
  
  	if (RandomSkinSelective) {
		skin = getRandomListSkin(serverGame);
	}

  // Spawn the player with the specified skin
  if (InstantSpawn) {
    spawnPlayer(client, spawnLocation.pos, spawnLocation.rot, skin);
  } else {
    setTimeout(() => {
      spawnPlayer(client, spawnLocation.pos, spawnLocation.rot, skin);
    }, FadeScreenTime * 1000);
  }

  // Fade the camera if the FadeScreen setting is true
  if (FadeScreen) {
    gta.fadeCamera(client, false, FadeScreenWait / 2, FadeScreenColour);
    setTimeout(() => {
      gta.fadeCamera(client, true, FadeScreenWait / 2, FadeScreenColour);
    }, FadeScreenTime * 1000);
  }
});