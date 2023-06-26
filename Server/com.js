if (DebugMode) {
addCommandHandler("getpos", function(command, text, client) {
  let player = client.player;
  if (player != null) {
    let pos = client.player.position;
	let rot = client.player.heading;
	LemonConsoleLog(`[${pos.x}, ${pos.y}, ${pos.z}], [${rot}]`)
    LemonsMsg(`Your current position is: [${pos.x}, ${pos.y}, ${pos.z}], [${rot}]`, client);
  } else {
    LemonsMsgErr("Failed to retrieve player position.", client);
	
  }
});
}