/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    climate = ee.Image("WORLDCLIM/V1/BIO");
/***** End of imports. If edited, may not auto-convert in the playground. *****/


function aboveZero(x) {
  return ee.Number(x).max(0);
}

function averageClimate(polygon) {
  return climate.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  });
}

function scaleTemp(t) {
  return ee.Number(t).multiply(0.1);
}

var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  
  var city_climate = averageClimate(polygon);
  
  return ee.Feature(
    null, 
    new ee.Dictionary()
  )
  .set('city_rainfall_average_annual', city_climate.get('bio12'))
  .set('city_rainfall_average_max_monthly', city_climate.get('bio13'))
  .set('city_rainfall_average_min_monthly', city_climate.get('bio14'))
  .set('city_temperature_average_annual', scaleTemp(city_climate.get('bio01')))
  .set('city_temperature_average_max_monthly', scaleTemp(city_climate.get('bio05')))
  .set('city_temperature_average_min_monthly', scaleTemp(city_climate.get('bio06')))
  .set('city_temperature_average_range_monthly', scaleTemp(city_climate.get('bio07')))
  .set('city_name', feature.get('NAME_MAIN'));
});


Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-climate-to-gcs',
  fileNamePrefix: 'city_climate',
  bucket:'urban_ebird'
});

var viz = {opacity: 0.5};

Map.addLayer(climate, viz);
Map.addLayer(stats, {opacity: 0.3})