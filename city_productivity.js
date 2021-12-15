/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var ndvi = ee.ImageCollection("MODIS/006/MOD13Q1");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

function averageNdvi(polygon) {
  return ndvi.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  }).get('b1');
}

var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  var buffer_20k = polygon.buffer(20000).difference(polygon);
  var buffer_50k = polygon.buffer(50000).difference(polygon);
  var buffer_100k = polygon.buffer(100000).difference(polygon);
  return ee.Feature(
    null, 
    new ee.Dictionary()
  )
  .set('city_ndvi', averageNdvi(polygon))
  .set('region_20_ndvi', averageNdvi(buffer_20k))
  .set('region_50_ndvi', averageNdvi(buffer_50k))
  .set('region_100_ndvi', averageNdvi(buffer_100k))
  .set('city_name', feature.get('NAME_MAIN'));
});


Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-ndvi-to-gcs',
  fileNamePrefix: 'city_ndvi',
  bucket:'urban_ebird'
});

Map.addLayer(stats)