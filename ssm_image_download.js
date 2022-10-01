/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var worldRegion = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-165.42570123142005, 74.1588854479163],
          [-165.42570123142005, -48.354308745715706],
          [182.97273626857998, -48.354308745715706],
          [182.97273626857998, 74.1588854479163]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var ssm = ee.ImageCollection("NASA_USDA/HSL/SMAP10KM_soil_moisture")
  .select("ssm");

print(ssm);


var region = ee.Geometry.BBox(-122.0859, 37.0436, -122.0626, 37.0586)
Map.addLayer(region);

Export.image.toDrive({
  image: ssm
  description: 'WorldSSM.tiff',
  scale: 2500,
  region: worldRegion,
  fileFormat: 'GeoTIFF'
})