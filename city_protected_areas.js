/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    protected_areas = ee.Image("users/jamesr/ProtectedAreas2");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

function protected_area_coverage(polygon) {
  return ee.Dictionary(protected_areas.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: polygon,
    scale: 100,
    maxPixels: 300000000
  }).get('b1'));
}

function percentage_protected(polygon) {
  var cover_frequency = protected_area_coverage(polygon);
  var area_covered_by_protected = ee.Number(cover_frequency.get('1', 0));
  var total_area = ee.Number(polygon.area()).divide(10000);
  return ee.Dictionary()
    .set('total_area', total_area)
    .set('protected_area', area_covered_by_protected)
    .set('percent_protected', area_covered_by_protected.divide(total_area));
}


var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  
  var buffer_20k = polygon.buffer(20000).difference(polygon);
  var buffer_50k = polygon.buffer(50000).difference(polygon);
  var buffer_100k = polygon.buffer(100000).difference(polygon);
  
  return ee.Feature(polygon)
    .set('city_name', feature.get('NAME_MAIN'))
    .set('city_area_protected', percentage_protected(polygon).get('percent_protected'))
    .set('region_20km_area_protected', percentage_protected(buffer_20k).get('percent_protected'))
    .set('region_50km_area_protected', percentage_protected(buffer_50k).get('percent_protected'))
    .set('region_100km_area_protected', percentage_protected(buffer_100k).get('percent_protected'));
});

Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-protected-areas-to-gcs',
  fileNamePrefix: 'city_protected_areas',
  bucket:'urban_ebird'
});


Map.addLayer(stats)
  