bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
  if (serverGame != GAME_GTA_VC && serverGame != GAME_GTA_III) {
    LemonConsoleError("The Server is not running either GTA III or Vicecity");
    return;
  }
});



addEventHandler("OnPlayerJoined", (event, client) => {
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

    // Fade in the player's camera
    fadeCamera(client, true);
});

addEventHandler("onPedWasted", (event, wastedPed, attackerPed, weapon, pedPiece) => {
  if (!wastedPed.isType(ELEMENT_PLAYER)) {
    return;
  }

  let client = getClientFromPlayerElement(wastedPed);
  let spawnLocation;
  let skin = wastedPed.skin;
  
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