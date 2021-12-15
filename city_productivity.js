/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var ndvi = ee.ImageCollection("MODIS/006/MOD13Q1"),
    moisture = ee.ImageCollection("NASA_USDA/HSL/SMAP10KM_soil_moisture"),
    cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var ndvi_date = ndvi.select("NDVI").filterDate('2015-01-01', '2020-12-31')
               
function averageNdvi(polygon) {
  return ndvi_date.filterBounds(polygon).reduce(ee.Reducer.mean()).get("NDVI");
}

var ssm_date = moisture.select("ssm").filterDate('2015-01-01', '2020-12-31')
var susm_date = moisture.select("susm").filterDate('2015-01-01', '2020-12-31')

function averageSsm(polygon) {
  return ssm_date.filterBounds(polygon).reduce(ee.Reducer.mean()).get("ssm");
}

function averageSusm(polygon) {
  return susm_date.filterBounds(polygon).reduce(ee.Reducer.mean()).get("susm");
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
  .set('city_surface_moisture', averageSsm(polygon))
  .set('region_20_surface_moisture', averageSsm(buffer_20k))
  .set('region_50_surface_moisture', averageSsm(buffer_50k))
  .set('region_100_surface_moisture', averageSsm(buffer_100k))
  .set('city_subsurface_moisture', averageSusm(polygon))
  .set('region_20_subsurface_moisture', averageSusm(buffer_20k))
  .set('region_50_subsurface_moisture', averageSusm(buffer_50k))
  .set('region_100_subsurface_moisture', averageSusm(buffer_100k))
  .set('city_name', feature.get('NAME_MAIN'));
});


Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-ndvi-to-gcs',
  fileNamePrefix: 'city_ndvi',
  bucket:'urban_ebird'
});

Map.addLayer(stats)