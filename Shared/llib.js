let locations = [];
let skinList = [];
let ServerName = server.name;
let ServerGameMode = server.gameMode;
let playerPositions = [];
let serverGame = server.game;
let PlayerName = "muffin";

function PlayernameChange(newname) {
	PlayerName = newname;
}

addNetworkHandler("requestServerName", function(client) {
  triggerNetworkEvent("receiveServerName", client, ServerName, ServerGameMode, server.port);
});


function LemonConsoleLog(msg) {
  console.log("[LemonsSpawn] " + msg);
}

function LemonConsoleError(msg) {
  console.error("[LemonsSpawn] Error: " + msg);
}

function LemonsMsg(msg, client) {
  messageClient(`[LemonsSpawn] ${msg}`, client, Yellow);
}

function LemonsMsgErr(msg, client) {
  messageClient(`[LemonsSpawn] Error: ${msg}`, client, Red);
}

function addLocation(gameId, locationId, pos, rot) {
  if (!locations[gameId]) {
    locations[gameId] = [];
  }

  locations[gameId].push({
    locationId: locationId,
    pos: pos,
    rot: rot
  });
}


function getClosestLocation(pos) {
  let closestLocation = null;
  let closestDistance = Number.MAX_VALUE;

  // Iterate over the locations in the locations array
  for (let i = 0; i < locations[server.game].length; i++) {
    // Get the position of the current location
    let locationPos = locations[server.game][i].pos;
	let locationPosV = new Vec3(locationPos[0], locationPos[1], locationPos[2]);

    // Calculate the distance between the locationPos and the pos parameter
    let distance = locationPosV.distance(pos);

    // If the distance is smaller than the closestDistance, update the closestLocation and closestDistance
    if (distance < closestDistance) {
      closestLocation = locations[server.game][i].locationId;
      closestDistance = distance;
    }
  }

  // Return the closestLocation
  return closestLocation;
}






function getSpawnLocation(serverGame, JoinSpawn) {
	
    if (typeof locations[serverGame] != "undefined") {
        let spawnLocation = locations[serverGame].find(location => location.locationId === JoinSpawn);
        if (spawnLocation) {
            return {
                pos: spawnLocation.pos,
                rot: spawnLocation.rot
            };
        } else {
            LemonConsoleError('The locationId was not found');
        }
    }
}


function getRandomSkin(serverGame) {
  let maxNumber;

  if (serverGame === "GAME_GTA_SA") {
      maxNumber = 312;
  } else if (serverGame === "GAME_GTA_III") {
      maxNumber = 130;
  } else if (serverGame === "GAME_GTA_VC") {
      maxNumber = 187;
  } else {
      // Default max number if serverGame doesn't match any specified condition
      maxNumber = 78;
  }

  let skin = Math.floor(Math.random() * (maxNumber + 1));
  if (skin >= 26) {
      skin += 4;
  }
  return skin;
}


// Function to get the oldest position from the array
function getOldestPlayerPosition(client) {
  // Get the player object for the client
  let player = getPlayerFromClient(client);

  // Get the player positions array for the player
  let playerPositionsForPlayer = playerPositions[player.id];

  // Sort the array by timestamp
  playerPositions[player.id].sort(function(a, b) {
    return a.timestamp - b.timestamp;
  });

  // Return the oldest position from the array
  return {
    pos: playerPositions[player.id][0].pos,
    rot: playerPositions[player.id][0].rot
  };
}







// Function to delete player positions after a certain time
function deleteOldPlayerPositions() {
  // Get an array of all clients
  let clients = getClients();

  // Loop through the array of clients
  for (let i = 0; i < clients.length; i++) {
    // Get the player associated with the client
    let player = getPlayerFromClient(clients[i]);

    // Check if the player is alive
    if (player.health <= 0) {
      // If the player is not alive, skip the rest of the loop iteration
      continue;
    }

    // Get the player positions array for the player ID
    let playerPositionsForPlayer = playerPositions[player.id];
	
	if (!playerPositionsForPlayer) {
		return;
	}
    // Loop through the array of player positions
    for (let playerPosition of playerPositionsForPlayer) {
      // Get the current timestamp
      let timestamp = Date.now();

      // Calculate the time difference between the current timestamp and the timestamp of the player position
      let timeDifference = timestamp - playerPosition.timestamp;

      // If the time difference is greater than the maximum allowed time, delete the player position from the array
      if (timeDifference > NearbyDeathSpawnTimeFrame) {
        // Get the index of the player position in the array
        let index = playerPositionsForPlayer.indexOf(playerPosition);

        // Remove the player position from the array using the splice method
        playerPositionsForPlayer.splice(index, 1);
      }
    }
  }
}


// Function to track player positions
function trackPlayerPositions() {
  // Get all the clients on the server
  let clients = getClients();

  // Loop through all the clients
  for (let i = 0; i < clients.length; i++) {
    // Get the current client
    let client = clients[i];
    // Get the player object associated with the client
    let player = client.player;

    // Check if the playerPositions array has an entry for the player's ID
    if (!playerPositions[player.id]) {
      // If not, create an empty array for the player's ID
      playerPositions[player.id] = [];
    }

    // Add the location and heading of the player to the array
    playerPositions[player.id].push({
      timestamp: new Date().getTime(),
      pos: player.position,
      rot: player.heading
    });
  }
}


// Function to respawn a player
function respawnPlayer(client) {

  // Get the oldest player position
  let oldestPosition = getOldestPlayerPosition(client);

  // Spawn the player at the position
  spawnPlayer(oldestPosition.pos, oldestPosition.rot);
}

function getPlayerFromClient(client) {
  // Return the player object associated with the client
  return client.player;
}

function addSkin(gameId, skinId) {
  if (!skinList[gameId]) {
    skinList[gameId] = [];
  }

  skinList[gameId].push({
    skinId: skinId,
  });
}

function getRandomListSkin(serverGame) {
  // Make sure the skinList[gameId] is equal to serverGame
  if (!skinList[serverGame]) {
    LemonConsoleError("No skins found for gameId: " + serverGame);
    return DefaultSkin;
  }

  // Pick a random skin from the skinList[gameId]
  const randomSkin = skinList[serverGame][Math.floor(Math.random() * skinList[serverGame].length)];

  // If the skinId is not a whole number, return nothing and call the LemonConsoleError function
  if (!Number.isInteger(randomSkin.skinId)) {
    LemonConsoleError("Invalid skinId: " + randomSkin.skinId);
    return DefaultSkin;
  }

  // If the skinId is from the GAME_GTA_VC and its over 187, return nothing and call the LemonConsoleError function
  if (serverGame === GAME_GTA_VC && randomSkin.skinId > 187) {
    LemonConsoleError("Invalid skinId for gameId " + serverGame + ": " + randomSkin.skinId);
    return DefaultSkin;
  }

  // If the skinId is from the GAME_GTA_III and its over 126, return nothing and call the LemonConsoleError function
  if (serverGame === GAME_GTA_III && randomSkin.skinId > 126) {
    LemonConsoleError("Invalid skinId for gameId " + serverGame + ": " + randomSkin.skinId);
    return DefaultSkin;
  }

  // If the skinId is from the GAME_GTA_SA and its over 312, return nothing and call the LemonConsoleError function
  if (serverGame === GAME_GTA_SA && randomSkin.skinId > 312) {
    LemonConsoleError("Invalid skinId for gameId " + serverGame + ": " + randomSkin.skinId);
    return DefaultSkin;
  }

  // Return the skinId as a number
  return Number(randomSkin.skinId);
}

function getRandomLocation(gameId) {
  if (!locations[gameId]) {
    return null;
  }

  const gameLocations = locations[gameId];
  const randomIndex = Math.floor(Math.random() * gameLocations.length);
  const randomLocation = gameLocations[randomIndex];
  JoinSpawn = randomLocation.locationId;

  return {
    pos: randomLocation.pos,
    rot: randomLocation.rot
  };
}

function setCustomCords() {
  return {
    pos: CDSpawnCords,
    rot: CDSpawnRot
  };
}

function createDeathBlip(client, position) {
  let tmpBlip = null;



  if (server.game == GAME_GTA_III) {
    tmpBlip = GTA3DeathBlip;
  } else if (server.game == GAME_GTA_VC) {
    tmpBlip = GTAVCDeathBlip;
  } else if (server.game == GAME_GTA_SA) {
    tmpBlip = GTASADeathBlip;
  }

    if (LocalBlipOnly) {
      triggerNetworkEvent("deathBlip", client, tmpBlip);
    } else {
      let blip = gta.createBlip(tmpBlip, position, BlipSize, 0);

      setTimeout(function() {
        destroyElement(blip);
      }, BlipFadeTime * 1000);
    }
  
}
