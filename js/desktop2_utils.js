utils = (function(){

    return {
        getLayer: getLayer,
        getLayerUrl: getLayerUrl,
        parseOpacity: parseOpacity
    }

    // get layer object from the current mapJson
    function getLayer(id){
        layer = mapJson["layers"].filter(obj => {
            return obj.id === id
          })[0]
        return layer
    }

    // get URL for retreiving a GeoJson contained by a buffer of the neighborhood
    function getLayerUrl(layer){
        url = baseUrl+layer["id"]
        url += "/query?where=1%3D1&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson"
        url += "&inSR=4326&geometryType=esriGeometryEnvelope&geometry="+turf.bbox(turf.buffer(current_bounds,100,{units: 'meters'}))
        if('fields' in layer){
            fields = layer['fields']
            if('label_field' in layer){
                fields = fields.concat(layer['label_field'])
            }
            url += "&outFields="+fields.join()
        }else{
            url += "&outFields="
        }
        return url
    }

    // Convert 8bit value to normalized opacity
    function parseOpacity(inputOpacity){
        xMax = 1;
        xMin = 0;

        yMax = 255;
        yMin = 0;

        percent = (inputOpacity - yMin) / (yMax - yMin);
        output = percent * (xMax - xMin) + xMin;
        return output
    }


})();