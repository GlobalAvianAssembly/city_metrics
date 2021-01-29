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

var decimalplaces = ee.Number(100000);

function format(number) {
  return number.format('%g');
}

function getLandcover(frequencyDictionary, copernicusValue) {
  return ee.Number(frequencyDictionary.get(copernicusValue, 0));
}

function appendNumber(dictionary, prefix, key, value) {
  return dictionary.set(prefix + key, format(value))
}

function appendPercent(dictionary, prefix, key, value, area) {
  return dictionary.set(prefix + key, format(value.divide(area)));
}

function append(dictionary, prefix, key, value, area) {
  dictionary = appendNumber(dictionary, prefix, '_lc_' + key, value);
  dictionary = appendPercent(dictionary, prefix, '_pc_' + key, value, area);
  return dictionary;
}

exports.metrics = function(prefix, frequency, area) {
  var discrete = new ee.Dictionary(frequency.get('discrete_classification'));
  var totalLandCoverArea = ee.Number(discrete.values().reduce(ee.Reducer.sum()));
  
  var closedForestEvergreenNeedle = getLandcover(discrete, '111');
  var closedForestEvergreenBroadleaf = getLandcover(discrete, '112');
  var closedForestDeciduousNeedle = getLandcover(discrete, '113');
  var closedForestDeciduousBroadleaf = getLandcover(discrete, '114');
  var closedForestMixed = getLandcover(discrete, '115');
  var closedForestOther = getLandcover(discrete, '116');
  
  var closedForestTotal = closedForestEvergreenNeedle.add(closedForestEvergreenBroadleaf)
    .add(closedForestDeciduousNeedle).add(closedForestDeciduousBroadleaf).add(closedForestMixed)
    .add(closedForestOther);
    
  var openForestEvergreenNeedle = getLandcover(discrete, '121');
  var openForestEvergreenBroadleaf = getLandcover(discrete, '122');
  var openForestDeciduousNeedle = getLandcover(discrete, '123');
  var openForestDeciduousBroadleaf = getLandcover(discrete, '124');
  var openForestMixed = getLandcover(discrete, '125');
  var openForestOther = getLandcover(discrete, '126');
  
  var openForestTotal = openForestEvergreenNeedle.add(openForestEvergreenBroadleaf)
    .add(openForestDeciduousNeedle).add(openForestDeciduousBroadleaf).add(openForestMixed)
    .add(openForestOther);
    
  var result = new ee.Dictionary();
  result = append(result, prefix, 'unknown', getLandcover(discrete, '0'), totalLandCoverArea);
  result = append(result, prefix, 'moss_and_lichen', getLandcover(discrete, '100'), totalLandCoverArea);
  
  result = append(result, prefix, 'closed_forest_evergreen_needle', closedForestEvergreenNeedle, totalLandCoverArea);
  result = append(result, prefix, 'closed_forest_evergreen_broadleaf', closedForestEvergreenBroadleaf, totalLandCoverArea);
  result = append(result, prefix, 'closed_forest_deciduous_needle', closedForestDeciduousNeedle, totalLandCoverArea);
  result = append(result, prefix, 'closed_forest_deciduous_broadleaf', closedForestDeciduousBroadleaf, totalLandCoverArea);
  result = append(result, prefix, 'closed_forest_forest_mixed', closedForestMixed, totalLandCoverArea);
  result = append(result, prefix, 'closed_forest_forest_other', closedForestOther, totalLandCoverArea);
  result = append(result, prefix, 'closed_forest_forest_total', closedForestTotal, totalLandCoverArea);
  
  result = append(result, prefix, 'open_forest_evergreen_needle', openForestEvergreenNeedle, totalLandCoverArea);
  result = append(result, prefix, 'open_forest_evergreen_broadleaf', openForestEvergreenBroadleaf, totalLandCoverArea);
  result = append(result, prefix, 'open_forest_deciduous_needle', openForestDeciduousNeedle, totalLandCoverArea);
  result = append(result, prefix, 'open_forest_deciduous_broadleaf', openForestDeciduousBroadleaf, totalLandCoverArea);
  result = append(result, prefix, 'open_forest_forest_mixed', openForestMixed, totalLandCoverArea);
  result = append(result, prefix, 'open_forest_forest_other', openForestOther, totalLandCoverArea);
  result = append(result, prefix, 'open_forest_forest_total', openForestTotal, totalLandCoverArea);
  
  result = append(result, prefix, 'shrubs', getLandcover(discrete, '20'), totalLandCoverArea);
  result = append(result, prefix, 'ocean', getLandcover(discrete, '200'), totalLandCoverArea);
  result = append(result, prefix, 'herbaceous_vegetation', getLandcover(discrete, '30'), totalLandCoverArea);
  result = append(result, prefix, 'cultivated', getLandcover(discrete, '40'), totalLandCoverArea);
  result = append(result, prefix, 'urban', getLandcover(discrete, '50'), totalLandCoverArea);
  result = append(result, prefix, 'bare', getLandcover(discrete, '60'), totalLandCoverArea);
  result = append(result, prefix, 'snow', getLandcover(discrete, '70'), totalLandCoverArea);
  result = append(result, prefix, 'permanent_water', getLandcover(discrete, '80'), totalLandCoverArea);
  result = append(result, prefix, 'herbaceous_wetland', getLandcover(discrete, '90'), totalLandCoverArea);
 
  result = appendNumber(result, prefix, '_calcuated_area', area.divide(10000));
  result = appendNumber(result, prefix, '_lc_area', totalLandCoverArea);
  
  return result;
}