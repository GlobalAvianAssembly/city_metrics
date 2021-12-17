/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    protected_areas = ee.Image("users/jamesr/ProtectedAreas2");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

protected_area_coverage = function(polygon, maxPixels) {
  return protected_areas.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: polygon,
    scale: 100,
    maxPixels: maxPixels
  });
}
