/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var ndvi = ee.ImageCollection("MODIS/006/MOD13Q1"),
    moisture = ee.ImageCollection("NASA_USDA/HSL/SMAP10KM_soil_moisture"),
    cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

function averageNdvi(polygon) {
  return ndvi.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  }).get('NDVI');
}

function averageMoisture(polygon) {
  return moisture.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  });
}

var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  var buffer_20k = polygon.buffer(20000).difference(polygon);
  var buffer_50k = polygon.buffer(50000).difference(polygon);
  var buffer_100k = polygon.buffer(100000).difference(polygon);
  
  var city_moisture = averageMoisture(polygon)
  var buffer_20k_city_moisture = averageMoisture(buffer_20k)
  var buffer_50k_city_moisture = averageMoisture(buffer_50k)
  var buffer_100k_city_moisture = averageMoisture(buffer_100k)
  
  
  return ee.Feature(
    null, 
    new ee.Dictionary()
  )
  .set('city_ndvi', averageNdvi(polygon))
  .set('region_20_ndvi', averageNdvi(buffer_20k))
  .set('region_50_ndvi', averageNdvi(buffer_50k))
  .set('region_100_ndvi', averageNdvi(buffer_100k))
  .set('city_surface_moisture', city_moisture.get("ssm"))
  .set('region_20_surface_moisture', buffer_20k_city_moisture.get("ssm"))
  .set('region_50_surface_moisture', buffer_50k_city_moisture.get("ssm"))
  .set('region_100_surface_moisture', buffer_100k_city_moisture.get("ssm"))
  .set('city_subsurface_moisture', city_moisture.get("susm"))
  .set('region_20_subsurface_moisture', buffer_20k_city_moisture.get("susm"))
  .set('region_50_subsurface_moisture', buffer_50k_city_moisture.get("susm"))
  .set('region_100_subsurface_moisture', buffer_100k_city_moisture.get("susm"))
  .set('city_name', feature.get('NAME_MAIN'));
});


Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-ndvi-to-gcs',
  fileNamePrefix: 'city_ndvi',
  bucket:'urban_ebird'
});

Map.addLayer(stats)