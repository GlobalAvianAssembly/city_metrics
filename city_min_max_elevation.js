/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    elevation = ee.Image("users/jamesr/world_digital_elevation_model");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var elevationDelta = elevation.reduceRegions(cities, ee.Reducer.minMax());

Map.addLayer(elevationDelta);

Export.table.toCloudStorage({
  collection: elevationDelta,
  description: 'Export-city-elevation-delta',
  fileNamePrefix: 'ee_city_elevation_delta',
  bucket:'urban_ebird'
});