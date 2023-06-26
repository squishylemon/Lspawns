if (DebugMode) {
let noclipActivated = false;

addCommandHandler('noclip', function(command, text) {
    if (noclipActivated) {
        noclipActivated = false;
        localPlayer.invincible = false;
        console.log('Noclip deactivated');
        
    } else {
        noclipActivated = true;
        localPlayer.invincible = true;
        console.log('Noclip activated');
    }
});

addCommandHandler('goto', function(command, text) {
     var positions = text.split(" ");
     if (positions.length === 3) {
         var x = parseFloat(positions[0]);
         var y = parseFloat(positions[1]);
         var z = parseFloat(positions[2]);
 
         localPlayer.position = [x, y, z];
     }
 });
 

 addEventHandler("OnDrawnHUD", function(event) {
     if (noclipActivated) {
         var currentPosition = localPlayer.position;
 
         if (isKeyDown(SDLK_w)) {
             currentPosition.y += 1; // Move up
         }
         if (isKeyDown(SDLK_a)) {
             currentPosition.x -= 1; // Move left
         }
         if (isKeyDown(SDLK_s)) {
             currentPosition.y -= 1; // Move down
         }
         if (isKeyDown(SDLK_d)) {
             currentPosition.x += 1; // Move right
         }
         if (isKeyDown(SDLK_LSHIFT) || isKeyDown(SDLK_RSHIFT)) {
             currentPosition.z += 1; // Move forward
         }
         if (isKeyDown(SDLK_LCTRL) || isKeyDown(SDLK_RCTRL)) {
             currentPosition.z -= 1; // Move backward
         }
 
         localPlayer.position = currentPosition;
         localPlayer.velocity = new Vec3(0, 0, 0); // Set velocity to zero to prevent falling
     }
 });
} 