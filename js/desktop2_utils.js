utils = (function(){

    return {
        getUniqueName: getUniqueName,
        getLayer: getLayer,
        getLayerUrl: getLayerUrl,
        parseOpacity: parseOpacity,
        updateCurrentBounds: updateCurrentBounds,
        updateSource: updateSource,
        getParamsFromUrl: getParamsFromUrl,
        checkPointCRS: checkPointCRS,
        getAddressPoint: getAddressPoint,
        getStreetLine: getStreetLine,
        getLayerOID: getLayerOID,
        getLayerFeature: getLayerFeature
    }

    // generate unique ID
    function getUniqueName(n=8){
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < n; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
        }

    // get layer object from the current mapJson
    function getLayer(mapJson,id){
        let layer = mapJson["layers"].filter(obj => {
            return obj.id === id
          })[0]
        return layer
    }

    // get URL for retreiving a GeoJson contained by a buffer of the neighborhood
    function getLayerUrl(layer){

        countUrl = baseUrl+layer["id"]+"/query?"
        
        let buffered = turf.buffer(current_bounds,100,{units: 'meters'})
        let geom;
        if(current_bounds.type === "Feature"){
            geom = buffered.geometry
        }else{
            geom = buffered.features[0].geometry
        }
        let baseEsriPolygon = {"rings":geom.coordinates,
        "spatialReference": {
          "wkid": 4326
        }}
        
        
        var params = {
            where:'1=1',
            returnGeometry:true,
            geometryPrecision:6,
            outSR:4326,
            f:'json',
            returnIdsOnly:true,
            returnCountOnly:false,
            inSR:4326,
            geometryType:'esriGeometryPolygon',
            geometry:JSON.stringify(baseEsriPolygon)
            }
        //countUrl += new URLSearchParams(params).toString();
        let form_data = new FormData();

        for ( var key in params) {
            form_data.append(key, params[key]);
        }

        fetch(countUrl,{ method: "POST", body: form_data })
        .then(res => res.json())
        .then(data => {
            featureIDs = data["objectIds"]
            if(featureIDs){
                getLayerData(featureIDs,layer)
            }
        })
        
        
        
        

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

    function updateCurrentBounds(map){
        bounds = map.getBounds()
        east = bounds.getEast()
        west = bounds.getWest()
        north = bounds.getNorth()
        south = bounds.getSouth()
        coords = [west, north,east,south]
        return turf.bboxPolygon(coords)
    }

    function getLayerData(featureIDs,layer){
        try{
            let requests = [];
            let baseGeoJson = {
                "type": "FeatureCollection",
                "features": []
            }
            for(var i=0; i<featureIDs.length;i += 100){
                let ids = featureIDs.slice(i,i+100)
                let queryUrl = baseUrl+layer["id"]+"/query?"
                var params = {
                    where:'1=1',
                    returnGeometry:true,
                    geometryPrecision:6,
                    outSR:4326,
                    f:'geojson',
                    objectIds: ids.join()
                    }
                if('fields' in layer){
                    fields = layer['fields']
                    if('label_field' in layer){
                        fields = fields.concat(layer['label_field'])
                    }
                    params["outFields"] = fields.join()
                }
                //queryUrl += new URLSearchParams(params).toString();
                let query = {url:queryUrl,params:params}
                requests.push(query)
            }
            requests.forEach(element => {
                getDataBatch(element)
                .then(rows => {
                    let features = rows.features;
                    baseGeoJson.features.push(...features)
                    updateSource(layer,baseGeoJson)
                })
                
            });
    }catch(err){
        console.log(err)
        console.log('Error at getLayerData')
        console.log(featureIDs,layer)
    }

    }

    async function getDataBatch(element){
        let url = element["url"];
        let params = element["params"];
        let form_data = new FormData();

        for ( var key in params) {
            form_data.append(key, params[key]);
        }
        let res = await fetch(url,{ method: "POST", body: form_data });
        let data = await res.json();
        return data;
    }

    function updateSource(layer,data){
        let sourceName =  layer['name']+"-source"
        let layerSource = map.getSource(sourceName)
        layerSource.setData(data)
    }

    function getParamsFromUrl(url) {
        try {
            url = decodeURI(url);
            if (typeof url === 'string') {
                let params = url.split('?');
                let obj = {};
                if(params.length < 2){
                    return obj
                }
                let eachParamsArr = params[1].split('&');
                if (eachParamsArr && eachParamsArr.length) {
                    eachParamsArr.map(param => {
                        let keyValuePair = param.split('=')
                        let key = keyValuePair[0];
                        let value = keyValuePair[1];
                        obj[key] = value;
                    })
                }
                return obj;
            }   
        } catch (error) {
            
        }
    }

    function checkPointCRS(coordinates,mapCenterRadius){
        let point = turf.point(coordinates);
        let invertedPoint = turf.point([coordinates[1],coordinates[0]]);
        let bounds = turf.bboxPolygon(city_bounds.extent.bbox)
        let radius = mapCenterRadius/1000
        let buffered;
        
        if(turf.booleanWithin(point,bounds)){
            buffered = turf.buffer(point, radius, {units: 'kilometers'});
        }else if(turf.booleanWithin(invertedPoint,bounds)){
            buffered = turf.buffer(invertedPoint, radius, {units: 'kilometers'});
        }else{
            newCoords = projConverter.inverse(coordinates)
            newReverseCoords = projConverter.inverse([coordinates[1],coordinates[0]])
            point = turf.point(newCoords);
            invertedPoint = turf.point(newReverseCoords);
            if(turf.booleanWithin(point,bounds)){
                buffered = turf.buffer(point, radius, {units: 'kilometers'});
            }else if(turf.booleanWithin(invertedPoint,bounds)){
                buffered = turf.buffer(invertedPoint, radius, {units: 'kilometers'});
            }
        }
        return buffered
    }

    async function getAddressPoint(k_rechov,ms_bayit){
        let url = `https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/527/query?where=k_rechov=${k_rechov}+AND+ms_bayit=${ms_bayit}&outFields=*&returnGeometry=true&geometryPrecision=7&outSR=4326&returnExtentOnly=false&f=geojson`
        let response = await fetch(url)
        let data = await response.json()
        return data;
    }

    async function getStreetLine(k_rechov){
        let url = `https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/527/query?where=k_rechov=${k_rechov}&returnGeometry=true&outSR=4326&returnExtentOnly=true&f=geojson`
        let response = await fetch(url)
        let data = await response.json()
        let polygon = await turf.bboxPolygon(data.extent.bbox)
        polygon = await turf.buffer(polygon,0.075)
        return polygon
        
    }

    async function getLayerOID(layer_id,service="https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer"){
        let url = service+'/'+ layer_id+'?f=json'
        let response = await fetch(url)
        let data = await response.json()
        let fieldName = await data.fields[data.fields.findIndex(x => x.type === "esriFieldTypeOID")].name
        return fieldName

    }

    async function getLayerFeature(
        service="https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/",
        layer_id,
        feature_id=1,
        where=""){
            let baseUrl =  ''.concat(service, layer_id, '/query?')
            let baseParameters = 'outFields=*&returnGeometry=true&geometryPrecision=7&outSR=4326&f=geojson&returnExtentOnly=true'
            if(where.length > 1){
                let url = baseUrl + baseParameters + `&where=${where}`
                let response = await fetch(url)
                let feature = await response.json()
                let polygon = await turf.bboxPolygon(feature.extent.bbox)
                return polygon
            }else{
                let metaDataUrl = service+ layer_id+'?f=json'
                let response = await fetch(metaDataUrl)
                let data = await response.json()
                let OIDfieldName = await data.fields[data.fields.findIndex(x => x.type === "esriFieldTypeOID")].name
                let url = await baseUrl + baseParameters + `&where=${OIDfieldName}=${feature_id}`
                await console.log(url)
                let response2 = await fetch(url)
                let feature = await response2.json()
                let polygon = await turf.bboxPolygon(feature.extent.bbox)
                return polygon
            }
            

    }
})();
/**
 * Utility functions
 * @module utils
 */
 
 /**
 * Generate unique ID
 * @function
 * @name getUniqueName
 * @param {integer} n - length of the unique ID, by default n=8.
 * @return {string}   A unique combination of only letters and numbers to be used as an ID.
 */
	 
/**
 * Get layer object from the current mapJson
 * @function
 * @name getLayer
 * @param {integer} id - ID of the layer as defined in the ArcGIS server service and as defined by the "id" key in the layer object.
 * @return {object}   A layer object from the map configuration file.
 */
/**
 * get URL for retreiving a GeoJson contained by a buffer of the neighborhood
 * @function
 * @name getLayerUrl
 * @param {Object} layer - An object of [mapJson-layer]{@link mapJson-layer} type
 * @return {string}   A URL for the subset of the layer features required by the defined extent/polyogn
 */
/**
 * Convert 8bit value to normalized opacity (0-255 -> 0.0-1.0)
 * @function
 * @name parseOpacity
 * @param {integer} inputOpacity - Value between 0 and 255
 * @return {number}   A normalized value between 0 and 1
 */
/**
 * Returns current map bounds as a GeoJson polygon feature
 * @function
 * @name updateCurrentBounds
 * @param {Object} map - A [MapLibre map]{@link https://maplibre.org/maplibre-gl-js-docs/api/map/} object
 * @return {GeoJson~Feature} - A GeoJson [Feature]{@link https://tools.ietf.org/html/rfc7946#section-3.2}[<Polygon>]{@link https://tools.ietf.org/html/rfc7946#section-3.1.6}, Result of [Turf.js bboxPolygon]{@link https://turfjs.org/docs/#bboxPolygon}
 */
/**
 * Replaces the data currently used data for the layer's source
 * @function
 * @name updateSource
 * @param {mapJson-layer} layer - An object of [mapJson-layer]{@link mapJson-layer} type
 * @param {GeoJson} data - A GeoJson Object
 */
/**
 * Parses url query string parameters and returns an object of key:value pairs
 * @function
 * @name getParamsFromUrl
 * @param {String} url - the current location, extracted using decodeURI(location), needed for parameters
 * @return {Object} QS an object containing all url parameters after "?" as key:value pairs.
 */
/**
 * Checks if the input coordinates are in EPSG:4326 or EPSG:2039 and creates a buffer for the ceneter coordinate using the mapCenterRadius in meters.
 * @function
 * @name checkPointCRS
 * @param {Array} coordinates - center coordinates for the buffer in EPSG:4326 or EPSG:2039
 * @param {Integer} mapCenterRadius - Radius for the created buffer, in meters
 * @return {GeoJson~Feature} Result of the [Turf.js buffer]{@link https://turfjs.org/docs/#buffer}
 */
/**
 * Get a Geojson Object of the requested address (street code and house number)
 * @function
 * @name getAddressPoint
 * @param {Integer} k_rechov - Street code from the [addresses layer]{@link https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/527}
 * @param {Integer} ms_bayit - House number on the street 
 * @return {GeoJson} 
 */
/**
 * Get a Geojson Object of the requested street's extent, with a buffer of 75 meters
 * @function
 * @name getStreetLine
 * @param {Integer} k_rechov - Street code from the [addresses layer]{@link https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/527}
 * @return {GeoJson} 
 */
/**
 * Get the layer's Object ID field name
 * ArcGIS Server has a designated field type of ObjectID (defined as "esriFieldTypeOID")
 * The field name can vary since it can be altered, so in order to extract features by ID, the field name is needed.
 * @function
 * @name getLayerOID
 * @param {Integer} layer_id - layer ID in the map/feature service
 * @param {string} [service="https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer"] - The Service from which to extract the layer fields
 * @return {string} The field name of the layer's Object ID
 */
/**
 * Extract a single feature from a map/feature server layer
 * Returns a GeoJson of 
 * @function
 * @name getLayerFeature
 * @param {String} [service="https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/"] - The service from which to extract features
 * @param {Integer} layer_id - layer ID in the map/feature service
 * @param {Integer} [feature_id=1] - The ID of the feature to extract
 * @param {String} [where=""] Where clause for the query rest API
 * @return {GeoJson}
 */