utils = (function(){

    return {
        getLayer: getLayer,
        getLayerUrl: getLayerUrl,
        parseOpacity: parseOpacity,
        updateCurrentBounds: updateCurrentBounds,
        updateSource: updateSource,
        getParamsFromUrl: getParamsFromUrl,
        checkPointCRS: checkPointCRS
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

        countUrl = baseUrl+layer["id"]+"/query?"
        
        let geom = turf.buffer(current_bounds,100,{units: 'meters'}).geometry
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
            getLayerData(featureIDs,layer)
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
        url = decodeURI(url);
        if (typeof url === 'string') {
            let params = url.split('?');
            let eachParamsArr = params[1].split('&');
            let obj = {};
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
})();