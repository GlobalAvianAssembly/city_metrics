/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var landcover_1 = ee.ImageCollection("COPERNICUS/Landcover/100m/Proba-V-C3/Global"),
    geometry = /* color: #d63000 */ee.Geometry.MultiPoint();
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var survey_sites = ee.List(
  {
    x: 51.31073,
    y: -2.65489,
    species_count: 91,
    site_name: 'Bath and North East Somerset , Bath and North East Somerset , Compton Martin - St. Michael the Archangel churchyard'
  }
)

var survey_sites_geom = locations.map(function(site) {
  return ee.Feature(
    ee.Geometry.Point([site.get('x'), site.get('y')]),
    {
      species_count: site.get('species_count'),
      site_name: site.get('site_name')
    }
  );
})


function create_buffer_around_point(point, buffer_metres) {
  point.buffer(buffer_metres)
}

Map.addLayer(survey_sites_geom.map(function(s) {create_buffer_around_point(s, 100)}))