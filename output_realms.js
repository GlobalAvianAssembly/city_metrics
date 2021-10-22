/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var resolve = ee.FeatureCollection("RESOLVE/ECOREGIONS/2017");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

Export.table.toCloudStorage({
  collection: resolve,
  description: 'resolve',
  fileNamePrefix: 'resolve',
  bucket:'urban_ebird'
});

Map.addLayer(resolve);