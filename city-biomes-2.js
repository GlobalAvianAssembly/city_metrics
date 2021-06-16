/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    biome = ee.Image("OpenLandMap/PNV/PNV_BIOME-TYPE_BIOME00K_C/v01");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var coverage = function(polygon) {
  return biome.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: polygon,
    scale: 100,
    maxPixels: 15000000
  });
}

var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  var frequency_city = coverage(polygon);
  
  return ee.Feature(
    null, 
    new ee.Dictionary().set('city', feature).set('coverage', frequency_city)
  );
  
});

print(stats);

Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-biome-2',
  fileNamePrefix: 'city-biome-2',
  bucket:'urban_ebird'
});

Map.addLayer(stats);