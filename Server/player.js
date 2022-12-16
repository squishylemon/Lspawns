bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
  // Set an interval to track player positions every PlayerSync seconds
  PlayerSync = PlayerSync * 1000;
  NearbyDeathSpawnTimeFrame = NearbyDeathSpawnTimeFrame * 1000;
  setInterval(trackPlayerPositions, PlayerSync);

  // Set an interval to delete old player positions every NearbyDeathSpawnTimeFrame seconds
  setInterval(deleteOldPlayerPositions, NearbyDeathSpawnTimeFrame);
});