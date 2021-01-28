/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var hotspots = ee.FeatureCollection("users/jamesr/UrbanHotspots");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

print(hotspots);

Map.addLayer(hotspots);