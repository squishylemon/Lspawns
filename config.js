// This script works for Vice City and GTA3 ONLY!

// ----------------------------------------------------------------------------
// JoinSpawnPoint Settings (When player joins)

// If you spawn in the air, double-check that this value equals one of the options below.

// FOR VICECITY
// Vice_Point
// Prawn_Island
// Downtown
// City_Scrap
// Little_Haiti
// EIA (Escobar International Airport)
// Vice_Port
// Ocean_Beach
// Washington_Beach
// Starfish_Island
// Leaf_Links

// For a map of the approximate area: https://www.gta.cz/data/vice-city/mapy/mapa_oblasti.jpg

// FOR GTA3
// Atlantic_Quays
// Callahan_Bridge
// Callahan_Point
// ChinaTown
// Harwood
// Hepburn_Heights
// Portland_Beach
// Portland_Harbor
// Portland_View
// RLD (Red Light District)
// Saint_Mark
// Trenton
// Cedar_Grove
// Cochrane_Dam
// FIA (Francis International Airport)
// Liberty_City
// Pike_Creek
// Shoreside_Vale
// Wichita_Garden
// Aspatria
// Bedford_Point
// Belleville_Park
// Fort_Staunton
// Liberty_Campus
// Rockford
// Newport
// Staunton_Island
// Torrington

// For a map of the approximate area:
// Staunton: https://gamefaqs.gamespot.com/ps2/466217-grand-theft-auto-iii/map/561?raw=1
// Portland: https://gamefaqs.gamespot.com/ps2/466217-grand-theft-auto-iii/map/560?raw=1
// Shoreside: https://gamefaqs.gamespot.com/ps2/466217-grand-theft-auto-iii/map/562?raw=1
// (Unfortunately, I couldn't find a full map for GTA3.)

let CustomSpawn = false; // Are you using a custom spawn?
let RandomSkin = false; // Spawn with a random skin?
let DefaultSkin = 1; // (Ignore if randomspawn is on) Set number to skin ID.
// GTA3: https://wiki.gtaconnected.com/Resources/GTA3/PedSkins
// GTAVC: https://wiki.gtaconnected.com/Resources/GTAVC/PedSkins
let JoinSpawn = 'Ocean_Beach'; // Insert any of the above options for your game.
let RandomSpawn = false;
let CSpawnCords = new Vec3(0, 0, 500); // Coordinates for custom spawn. (0, 0, 500) will spawn in the middle of the map at height 500.
let CSpawnRot = 0; // Z-rotation when spawned (ignore if customspawn is false).

// ----------------------------------------------------------------------------
// Respawn Settings (when you die and respawn)

let RandomSkinRespawn = false; // Sets the skin to a random one when respawning.
let RandomSkinSelective = false // Picks a random skin from the list below.
let NearbyDeathSpawn = false; // Spawn in the position of the player NearbyDeathSpawnTimeFrame seconds ago.
let NearbySpawn = true; // Spawn a	t the closest spawnpoint (spawn points are listed in JoinSpawn settings).
let InstantSpawn = false; // Instantly respawns (if fade screen is true, it will fade before spawning).
let FadeScreen = true; // Fade the screen to black before respawning (makes it nicer).
let FadeScreenWait = 5; // How long it takes to fade in and out.
let FadeScreenTime = 5; // How long it takes to respawn (ignore if using instant spawn).
let FadeScreenColour = toColour(255, 255, 255, 255); // The color the screen fades to. (Red, green, blue, alpha)
let PlayerSync = 1; // In seconds, how often the player tracker adds all connected players' positions and heading.
let NearbyDeathSpawnTimeFrame = 5; // How far back does the player respawn in seconds from death?


//----------------Connection/Disconnection Settings

let DisconnectMessageEnabled = true; // Enable/Disable disconnected messages

let DisconnectMessageColor = Red; // sets the color of the disconnceted message

var DisconnectMessage =()=> `[${ServerName}] ${PlayerName} has disconnected!`; // Message for everyone on the server when a player disconnects

let JoinMessageEnabled = true; // Enable/Disable Join Messages

let JoinMessageColor = Yellow; // sets the color of the join message

var JoinMessage =()=> `[${ServerName}] ${PlayerName} has started to connect to the server!`; // Message for everyone on the server when a player starts to connect

let ConnectedMessageEnabled = true; // Enable/Disable connected messages

let ConnectedMessageColor = Green; // sets the color of the connected message

var ConnectedMessage =()=> `[${ServerName}] ${PlayerName} has fully connected!`; // Message for everyone when the player has fully loaded into the server

let WelcomeMessageEnabled = true; // Enable/Disable the welcome message

let WelcomeMessageColor = Blue; // sets the color of the welcome message

var WelcomeMessage =()=> `Welcome ${PlayerName} to ${ServerName}!`; // Message to the player who just joinned

//----------------DeathBlip Settings

// GTAVC Blips https://wiki.gtaconnected.com/Resources/GTAVC/RadarBlips
// GTAIII Blips https://wiki.gtaconnected.com/Resources/GTA3/RadarBlips

let DeathBlipsEnabled = true; // Enable the deathblip system
let LocalBlipOnly = false; // Makes it so only the player who died sees the blip instead of the hole server
let BlipFadeTime = 15; // Time in seconds before the blip disappears
let BlipSize = 2; // Size of the blip on the map
let GTA3DeathBlip = 0; // Icon for the GTA3 Blip
let GTAVCDeathBlip = 23; // Icon for the GTAVC Blip


// ---CopyPate varibles for messages (dont copy // duh.)

// ${ServerName}
// ${PlayerName}
// ${ServerGameMode}

//

//---------TO USE THESE ENABLE RandomSkinSelective---------------
addSkin(GAME_GTA_III, 122); // Adds the Prison Claude skin to select from if your server is running gta3
addSkin(GAME_GTA_VC, 164); // Adds the Tommy Vercetti (Golfer) skin to select from if your server is running vicecity