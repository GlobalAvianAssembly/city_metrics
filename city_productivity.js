/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("WCMC/WDPA/current/polygons"),
    ndvi = ee.ImageCollection("MODIS/006/MOD13Q1");
/***** End of imports. If edited, may not auto-convert in the playground. *****/


Map.addLayer(table)