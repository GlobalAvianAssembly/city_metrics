/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var landcover_c3 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

exports.doc = 'The LandCoverage module generates the land coverage attributes for a polygon.' +
    '\n' +
    '\n metrics(prefix, frequency, area):' +
    '\n   @param {ee.String} prefix The prefix to put before all attributes' +
    '\n   @param {ee.Object} frequency The frequency object from generating land coverage of the polygon' +
    '\n   @param {ee.Number} area The calculated area of the polygon' +
    '\n   @return {ee.Dictionary} The dictionary of attributes to values' +
    '\n' +
    '\n coverage(polygon, maxPixels):' +
    '\n   @param {ee.Geometry} polygon The polygon to produce land cover frequency object for' +
    '\n   @param {ee.Number} maxPixels The maximum number of pixels to accept' +
    '\n   @return {ee.Object} The frequency object for land coverage ' +
    '\n'

exports.coverage = function(polygon, maxPixels) {
  return landcover_c3.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: polygon,
    scale: 100,
    maxPixels: maxPixels
  });
}

exports.metrics = function(prefix, frequency, area) {
  var discrete = new ee.Dictionary(frequency.get('discrete_classification'));
  var totalLandCoverArea = discrete.values().reduce(ee.Reducer.sum());
  
  var closedForestEvergreenNeedle = ee.Number(discrete.get('111', 0));
  var closedForestEvergreenBroadleaf = ee.Number(discrete.get('112', 0));
  var closedForestDeciduousNeedle = ee.Number(discrete.get('113', 0));
  var closedForestDeciduousBroadleaf = ee.Number(discrete.get('114', 0));
  var closedForestMixed = ee.Number(discrete.get('115', 0));
  var closedForestOther = ee.Number(discrete.get('116', 0));
  
  var closedForestTotal = closedForestEvergreenNeedle.add(closedForestEvergreenBroadleaf)
    .add(closedForestDeciduousNeedle).add(closedForestDeciduousBroadleaf).add(closedForestMixed)
    .add(closedForestOther);
    
  var openForestEvergreenNeedle = ee.Number(discrete.get('121', 0));
  var openForestEvergreenBroadleaf = ee.Number(discrete.get('122', 0));
  var openForestDeciduousNeedle = ee.Number(discrete.get('123', 0));
  var openForestDeciduousBroadleaf = ee.Number(discrete.get('124', 0));
  var openForestMixed = ee.Number(discrete.get('125', 0));
  var openForestOther = ee.Number(discrete.get('126', 0));
  
  var openForestTotal = openForestEvergreenNeedle.add(openForestEvergreenBroadleaf)
    .add(openForestDeciduousNeedle).add(openForestDeciduousBroadleaf).add(openForestMixed)
    .add(openForestOther);
    
  return new ee.Dictionary()
    .set(prefix + '_lc_unknown', discrete.get('0', 0))
    .set(prefix + '_pc_unknown', ee.Number(discrete.get('0', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_moss_and_lichen', discrete.get('100', 0))
    .set(prefix + '_pc_moss_and_lichen', ee.Number(discrete.get('100', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_closed_forest_evergreen_needle', closedForestEvergreenNeedle)
    .set(prefix + '_pc_closed_forest_evergreen_needle', closedForestEvergreenNeedle.divide(totalLandCoverArea))
    .set(prefix + '_lc_closed_forest_evergreen_broadleaf', closedForestEvergreenBroadleaf)
    .set(prefix + '_pc_closed_forest_evergreen_broadleaf', closedForestEvergreenBroadleaf.divide(totalLandCoverArea))
    .set(prefix + '_lc_closed_forest_deciduous_needle', closedForestDeciduousNeedle)
    .set(prefix + '_pc_closed_forest_deciduous_needle', closedForestDeciduousNeedle.divide(totalLandCoverArea))
    .set(prefix + '_lc_closed_forest_deciduous_broadleaf', closedForestDeciduousBroadleaf)
    .set(prefix + '_pc_closed_forest_deciduous_broadleaf', closedForestDeciduousBroadleaf.divide(totalLandCoverArea))
    .set(prefix + '_lc_closed_forest_mixed', closedForestMixed)
    .set(prefix + '_pc_closed_forest_mixed', closedForestMixed.divide(totalLandCoverArea))
    .set(prefix + '_lc_closed_forest_other', closedForestOther)
    .set(prefix + '_pc_closed_forest_other', closedForestOther.divide(totalLandCoverArea))
    .set(prefix + '_lc_closed_forest_total', closedForestTotal)
    .set(prefix + '_pc_closed_forest_total', closedForestTotal.divide(totalLandCoverArea))
    .set(prefix + '_lc_open_forest_evergreen_needle', openForestEvergreenNeedle)
    .set(prefix + '_pc_open_forest_evergreen_needle', openForestEvergreenNeedle.divide(totalLandCoverArea))
    .set(prefix + '_lc_open_forest_evergreen_broadleaf', openForestEvergreenBroadleaf)
    .set(prefix + '_pc_open_forest_evergreen_broadleaf', openForestEvergreenBroadleaf.divide(totalLandCoverArea))
    .set(prefix + '_lc_open_forest_deciduous_needle', openForestDeciduousNeedle)
    .set(prefix + '_pc_open_forest_deciduous_needle', openForestDeciduousNeedle.divide(totalLandCoverArea))
    .set(prefix + '_lc_open_forest_deciduous_broadleaf', openForestDeciduousBroadleaf)
    .set(prefix + '_pc_open_forest_deciduous_broadleaf', openForestDeciduousBroadleaf.divide(totalLandCoverArea))
    .set(prefix + '_lc_open_forest_mixed', openForestMixed)
    .set(prefix + '_pc_open_forest_mixed', openForestMixed.divide(totalLandCoverArea))
    .set(prefix + '_lc_open_forest_other', openForestOther)
    .set(prefix + '_pc_open_forest_other', openForestOther.divide(totalLandCoverArea))
    .set(prefix + '_lc_open_forest_total', openForestTotal)
    .set(prefix + '_pc_open_forest_total', openForestTotal.divide(totalLandCoverArea))
    .set(prefix + '_lc_shrubs', discrete.get('20', 0))
    .set(prefix + '_pc_shrubs', ee.Number(discrete.get('20', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_ocean', discrete.get('200', 0))
    .set(prefix + '_pc_ocean', ee.Number(discrete.get('200', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_herbaceous_vegetation', discrete.get('30', 0))
    .set(prefix + '_pc_herbaceous_vegetation', ee.Number(discrete.get('30', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_cultivated', discrete.get('40', 0))
    .set(prefix + '_pc_cultivated', ee.Number(discrete.get('40', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_urban', discrete.get('50', 0))
    .set(prefix + '_pc_urban', ee.Number(discrete.get('50', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_bare', discrete.get('60', 0))
    .set(prefix + '_pc_bare', ee.Number(discrete.get('60', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_snow', discrete.get('70', 0))
    .set(prefix + '_pc_snow', ee.Number(discrete.get('70', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_permanent_water', discrete.get('80', 0))
    .set(prefix + '_pc_permanent_water', ee.Number(discrete.get('80', 0)).divide(totalLandCoverArea))
    .set(prefix + '_lc_herbaceous_wetland', discrete.get('90', 0))
    .set(prefix + '_pc_herbaceous_wetland', ee.Number(discrete.get('90', 0)).divide(totalLandCoverArea))
    .set(prefix + '_calcuated_area', (area.divide(10000)))
    .set(prefix + '_lc_area', totalLandCoverArea)
  ;
}