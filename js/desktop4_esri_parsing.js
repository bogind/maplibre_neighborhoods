esriRenderer = (function(){

    return {
        getMetadata: getMetadata,
        parseSimpleRenderer: parseSimpleRenderer,
        parseUniqueValueRenderer: parseUniqueValueRenderer,
        loadImage:loadImage,
        updateRaster:updateRaster
    }

    /*
        get layer metadata (if vector) and start parsing draw info details in the renderer
    */
    function getMetadata(layer){
        if(layer.type && layer.type === "raster"){
            addRasterLayer(layer)
        }else{
            url = baseUrl+layer["id"]+"?f=pjson"
            fetch(url)
            .then(response => response.json())
            .then(data => {
                fields = {}
                if(data.fields && data.fields.length > 0){
                    for(var i =0;i< data["fields"].length;i++){
                        fieldName = data["fields"][i]["name"]
                        fields[fieldName] = data["fields"][i]
                    }
                }else{
                    console.log(data)
                }
                layer["metadata"] = fields
                geomType = data.geometryType
                renderer = data.drawingInfo.renderer
    
                if(renderer.type === "simple"){
                    parseSimpleRenderer(geomType,renderer,layer)
                }else if(renderer.type === "uniqueValue"){
                    parseUniqueValueRenderer(geomType,renderer,layer)
                }
            })
        }
    }

    /*
        activate specific simple renderer function
    */
    function parseSimpleRenderer(geomType,renderer,layer){
        if(geomType === "esriGeometryPoint"){
            return addSimplePointLayer(renderer,layer)
        }else if(geomType === "esriGeometryPolygon"){
            return addSimplePolygonLayer(renderer,layer)
        }else if(geomType === "esriGeometryPolyline"){
            return addSimpleLineLayer(renderer,layer)
        }else{
            console.log(geomType)
        }
    }

    /*
        activate specific unique value renderer function
    */
    function parseUniqueValueRenderer(geomType,renderer,layer){
        if(geomType === "esriGeometryPoint"){
            return parseUniqueValuePoint(renderer,layer)
        }else if(geomType === "esriGeometryPolygon"){
            return parseUniqueValuePolygon(renderer,layer)
        }else if(geomType === "esriGeometryPolyline"){
            return parseUniqueValueLine(renderer,layer)
        }else{
            console.log(geomType)
        }
    }

    /*
        Add a source with a layer having only one type of symbology - points
    */
    function addSimplePointLayer(renderer,layer){
        // simple Picture Marker Symbol
        if(renderer.symbol && 
            renderer.symbol.type === "esriPMS"){
                icon = "data:image/png;base64,"+renderer.symbol.imageData
                iconName = layer['name']+'-Icon'
                sourceName =  layer['name']+"-source"
                layerUrl = utils.getLayerUrl(layer)

                layerJson = {
                    'id': layer['name'],
                    'type': 'symbol',
                    'source': sourceName,
                    'layout': {
                    'icon-image':iconName,
                    'icon-allow-overlap':true,
                    'visibility': 'none'
                    },
                    "paint": { }
                }
                if('label_field' in layer){
                    layerJson['layout']['text-field'] = ['get',layer['label_field'][0]]
                    layerJson['layout']['text-anchor'] = "bottom-left"
                    layerJson['layout']['text-radial-offset'] = 1
                    layerJson['layout']['text-justify'] = 'auto'
                    layerJson['layout']['text-size'] = 10
                    layerJson['layout']['text-font'] = ["Arial Regular"]
                    layerJson['layout']['text-anchor'] = "bottom-left"
                    layerJson['paint']['text-color'] = "rgb(0,0,0)"
                    layerJson['paint']['text-halo-color'] = "rgb(250,245,217)"
                    layerJson['paint']['text-halo-width'] = 1.33
                }

                if(!map.hasImage(iconName)){
                    loadImage(iconName,icon,()=>{
                        if(map.getSource(sourceName) === undefined){
                            map.addSource(sourceName, {
                            type: 'geojson',
                            data: layerUrl
                            });
                            if(map.getLayer(layer['name']) === undefined){
                                map.addLayer(layerJson);
        
                                addPopupEvent(layer)
                                    
                                addMapHoverEvents(layer)

                            }else{
                                return
                            }
                        }else{
                            return
                        }
                    })

                    }else{
                        if(map.getSource(sourceName) === undefined){
                            map.addSource(sourceName, {
                            type: 'geojson',
                            data: layerUrl
                            });
                            if(map.getLayer(layer['name']) === undefined){
                                map.addLayer(layerJson);
        
                                addPopupEvent(layer)
                                    
                                addMapHoverEvents(layer)

                            }else{
                                return
                            }
                        }else{
                            return
                        }
                    }

        }
    }

    /*
        Add a source with a layer having only one type of symbology - lines
    */
    function addSimpleLineLayer(renderer,layer){
        if(renderer.symbol && 
            renderer.symbol.style === "esriSLSSolid"){
                sourceName =  layer['name']+"-source";
                layerUrl = utils.getLayerUrl(layer);
                lineColor = "rgb("+renderer.symbol.color.slice(0,3).join()+")";
                lineOpacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.symbol.color[3]);
                lineWidth = renderer.symbol.width
                layerJson = {
                    'id': layer['name'],
                    'type': 'line',
                    'source': sourceName,
                    'layout': {
                    'visibility': 'none'
                    },
                    'paint': {
                    'line-color': lineColor,
                    'line-opacity': lineOpacity,
                    'line-width':lineWidth
                    }
                }

                if(map.getSource(sourceName) === undefined){
                    map.addSource(sourceName, {
                    type: 'geojson',
                    data: layerUrl
                    });
                    if(map.getLayer(layer['name']) === undefined){
                        map.addLayer(layerJson);

                        addPopupEvent(layer)
                            
                        addMapHoverEvents(layer)

                        
                    }else{
                        return
                    }
                }else{
                    return
                    
                }


            }
    }

    /*
        Add a source with a layer having only one type of symbology - polygons 
    */
    function addSimplePolygonLayer(renderer,layer){

        if(renderer.symbol && 
            renderer.symbol.style === "esriSFSSolid"){
                sourceName =  layer['name']+"-source";
                layerUrl = utils.getLayerUrl(layer);
                fillColor = "rgb("+renderer.symbol.color.slice(0,3).join()+")";
                fillOpacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.symbol.color[3]);
                strokeLayerName = layer['name']+'-stroke'
                if(renderer.symbol.outline.width < 0.1 || renderer.symbol.outline.color[3] < 1){
                    drawOutline = true;
                    
                    strokeColor = "rgb("+renderer.symbol.outline.color.slice(0,3).join()+")";
                    strokeOpacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.symbol.outline.color[3]);
                    strokeWidth = renderer.symbol.outline.width
                    strokeLayerJson = {
                            'id': strokeLayerName,
                            'type': 'line',
                            'source': sourceName,
                            'layout': {
                            'visibility': 'none'
                            },
                            'paint': {
                            'line-color': strokeColor,
                            'line-opacity': strokeOpacity,
                            'line-width':strokeWidth
                            }
                        }
                }else{
                    drawOutline = false;
                }
                layerJson = {
                    'id': layer['name'],
                    'type': 'fill',
                    'source': sourceName,
                    'layout': {
                    'visibility': 'none'
                    },
                    'paint': {
                    'fill-color': fillColor,
                    'fill-opacity': fillOpacity
                    }
                }

                if(map.getSource(sourceName) === undefined){
                    map.addSource(sourceName, {
                    type: 'geojson',
                    data: layerUrl
                    });
                    if(map.getLayer(layer['name']) === undefined){
                        map.addLayer(layerJson);

                        addPopupEvent(layer)
                            
                        addMapHoverEvents(layer)

                        if(drawOutline && map.getLayer(strokeLayerName) === undefined){
                            map.addLayer(strokeLayerJson);
                        }
                    }else{
                        return
                    }
                }else{
                    return
                    
                }
            }
        if(renderer.symbol && renderer.symbol.style == "esriSFSBackwardDiagonal"){
            sourceName =  layer['name']+"-source";
            layerUrl = utils.getLayerUrl(layer);
        }
    }

    /*
        checking the type of symbols for unqiue value points
    */
    function parseUniqueValuePoint(renderer,layer){
        if(renderer.defaultSymbol){
            if(renderer.defaultSymbol.type &&
                renderer.defaultSymbol.type === "esriPMS"){
                    loadMultipleImages(renderer,layer)
                }
        }else if(renderer.uniqueValueInfos.length > 1 &&
            renderer.uniqueValueInfos[0].symbol &&
            renderer.uniqueValueInfos[0].symbol.type == "esriPMS"){
                loadMultipleImages(renderer,layer)
        }
        
    }

    /*
        Load all images for layers that use multiple images before creating the layer
    */
    function loadMultipleImages(renderer,layer){
        symbols = {}
        for(var i = 0; i< renderer.uniqueValueInfos.length;i++){
            valueInfo = renderer.uniqueValueInfos[i]
            valueInfo.symbol["iconName"] = layer["name"]+"-Icon"+(i+1)
            valueInfo.symbol.imageData = "data:image/png;base64,"+valueInfo.symbol.imageData
            symbols[valueInfo.value] = valueInfo.symbol
            loadImage(valueInfo.symbol.iconName,valueInfo.symbol.imageData)
        }
        // in case of missing default symbol, jsut use the first symbol as the default (required)
        if(renderer.defaultSymbol){
            renderer.defaultSymbol["iconName"] = layer["name"]+"-defaultIcon"
            renderer.defaultSymbol.imageData = "data:image/png;base64,"+renderer.defaultSymbol.imageData
            symbols["default"] = renderer.defaultSymbol
            if(!map.hasImage(renderer.defaultSymbol["iconName"])){
            
                map.loadImage(renderer.defaultSymbol.imageData, function(error, image) {
                if (error) throw error;
                map.addImage(renderer.defaultSymbol["iconName"], image);
                })
            }
        }else{
            symbols["default"] = symbols[Object.keys(symbols)[0]]
        }

        addUniqueValuePMSPointLayer(renderer,layer,symbols)
    }

    /*
        separate function to load images for synchronous loading
    */
    function loadImage(iconName,imageData,_callback){
        map.loadImage(imageData, function(error, image) {
            if (error) throw error;
            
            if(map.hasImage(iconName)){
                
            }else{
                map.addImage(iconName, image);
            }
        })
        if (_callback) {
            _callback();
        }
    }

    /*
        create source and layer for point layer using unique value renderer (classes) and image markers
        this needs to run after all the images have been added to the map
    */
    function addUniqueValuePMSPointLayer(renderer,layer,symbols){

        sourceName =  layer['name']+"-source"
        valueField = renderer.field1
        layerUrl = utils.getLayerUrl(layer)
        iconImage = ["match",["get",valueField]]
        values = Object.keys(symbols)
        for(var i=0;i<values.length;i++){
            iconImage.push([values[i]],symbols[values[i]].iconName)
        }
        iconImage.push(symbols["default"]["iconName"])
        layerJson = {
            'id': layer["name"],
            'type': 'symbol',
            'source': sourceName,
            'layout': {
            'icon-image':iconImage,
            'icon-allow-overlap':true,
            'visibility': 'none'
            },
            'paint':{

            }
        }


        if('label_field' in layer){
            layerJson['layout']['text-field'] = ['get',layer['label_field'][0]]
            layerJson['layout']['text-anchor'] = "bottom-left"
            layerJson['layout']['text-radial-offset'] = 1
            layerJson['layout']['text-justify'] = 'auto'
            layerJson['layout']['text-size'] = 10
            layerJson['layout']['text-font'] = ["Arial Regular"]
            layerJson['layout']['text-anchor'] = "bottom-left"
            layerJson['paint']['text-color'] = "rgb(0,0,0)"
            layerJson['paint']['text-halo-color'] = "rgb(250,245,217)"
            layerJson['paint']['text-halo-width'] = 1.33333
        }

        if(map.getSource(sourceName) === undefined){
            map.addSource(sourceName, {
            type: 'geojson',
            data: layerUrl
            });
            if(map.getLayer(layer['name']) === undefined){
                map.addLayer(layerJson);

                addPopupEvent(layer)
                    
                addMapHoverEvents(layer)

            }else{
                return
            }
        }else{
            return
            
        }
    }

    /*
        Add source and layers for lines with varying width, opacity and color
    */
    function parseUniqueValueLine(renderer,layer){
        
        sourceName =  layer['name']+"-source"
        layerUrl = utils.getLayerUrl(layer)
        if(renderer.field2){
            if(renderer.field3){
                valueField1 = renderer.field1
                valueField2 = renderer.field2
                valueField3 = renderer.field3
                deleimiter = renderer.fieldDelimiter
                colorExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2],deleimiter,["get",valueField3]]]
                opacityExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2],deleimiter,["get",valueField3]]]
                widthExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2],deleimiter,["get",valueField3]]]
            }else{
                valueField1 = renderer.field1
                valueField2 = renderer.field2
                colorExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2]]]
                opacityExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2]]]
                widthExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2]]]
            }
        }else{
            valueField = renderer.field1
            colorExpression = ["match",["get",valueField]]
            opacityExpression = ["match",["get",valueField]]
            widthExpression = ["match",["get",valueField]]
        }

        
        for(var i=0;i<renderer.uniqueValueInfos.length;i++){
            value = renderer.uniqueValueInfos[i].value
            color = "rgb("+renderer.uniqueValueInfos[i].symbol.color.slice(0,3).join()+")";
            opacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.uniqueValueInfos[i].symbol.color[3]);
            width = renderer.uniqueValueInfos[i].symbol.width ? renderer.uniqueValueInfos[i].symbol.width : 1;
            colorExpression.push(value,color)
            opacityExpression.push(value,opacity)
            widthExpression.push(value,width)

        }
        if(renderer.defaultSymbol){
            color = "rgb("+renderer.defaultSymbol.color.slice(0,3).join()+")";
            opacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.defaultSymbol.color[3]);
            width = renderer.defaultSymbol.width ? renderer.defaultSymbol.width : 1;
            colorExpression.push(color)
            opacityExpression.push(opacity)
            widthExpression.push(width)
        }else{
            colorExpression.push("#000000")
            opacityExpression.push(1)
            widthExpression.push(1)
        }
        layerJson = {
            'id': layer["name"],
            'type': 'line',
            'source': sourceName,
            'layout': {
            'visibility': 'none'
            },
            'paint':{
                'line-color': colorExpression,
                'line-opacity': opacityExpression,
                'line-width':widthExpression
            }
        }

        if(map.getSource(sourceName) === undefined){
            map.addSource(sourceName, {
            type: 'geojson',
            data: layerUrl
            });
            if(map.getLayer(layer['name']) === undefined){
                map.addLayer(layerJson);

                addPopupEvent(layer)
                    
                addMapHoverEvents(layer)

            }else{
                return
            }
        }else{
            return
            
        }

    }

    /*
        Add source and layers for polygons with varying opacity and fill color
    */
    function parseUniqueValuePolygon(renderer,layer){
            
        sourceName =  layer['name']+"-source"
        layerUrl = utils.getLayerUrl(layer)
        if(renderer.field2){
            if(renderer.field3){
                valueField1 = renderer.field1
                valueField2 = renderer.field2
                valueField3 = renderer.field3
                deleimiter = renderer.fieldDelimiter
                colorExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2],deleimiter,["get",valueField3]]]
                opacityExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2],deleimiter,["get",valueField3]]]
            }else{
                valueField1 = renderer.field1
                valueField2 = renderer.field2
                colorExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2]]]
                opacityExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2]]]
            }
        }else{
            valueField = renderer.field1
            colorExpression = ["match",["get",valueField]]
            opacityExpression = ["match",["get",valueField]]
        }

        symbols = []
        for(var i=0;i<renderer.uniqueValueInfos.length;i++){
            value = renderer.uniqueValueInfos[i].value
            color = "rgb("+renderer.uniqueValueInfos[i].symbol.color.slice(0,3).join()+")";
            opacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.uniqueValueInfos[i].symbol.color[3]);
            colorExpression.push(value,color)
            opacityExpression.push(value,opacity)

        }
        if(renderer.defaultSymbol){
            color = "rgb("+renderer.defaultSymbol.color.slice(0,3).join()+")";
            opacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.defaultSymbol.color[3]);
            colorExpression.push(color)
            opacityExpression.push(opacity)
        }else{
            colorExpression.push("#000000")
            opacityExpression.push(1)
        }
        layerJson = {
            'id': layer["name"],
            'type': 'fill',
            'source': sourceName,
            'layout': {
            'visibility': 'none'
            },
            'paint':{
                'fill-color': colorExpression,
                'fill-opacity': opacityExpression,
            }
        }

        if(map.getSource(sourceName) === undefined){
            map.addSource(sourceName, {
            type: 'geojson',
            data: layerUrl
            });
            if(map.getLayer(layer['name']) === undefined){
                map.addLayer(layerJson);

                addPopupEvent(layer)
                    
                addMapHoverEvents(layer)

            }else{
                return
            }
        }else{
            return
            
        }

    }

    /*
        add layer as raster image directly from the server
    */
    function addRasterLayer(layer){
        fetch(baseUrl+layer["id"]+"?f=json")
        .then(response => response.json())
        .then(data => {
            fields = {}
            for(var i =0;i< data["fields"].length;i++){
                fieldName = data["fields"][i]["name"]
                fields[fieldName] = data["fields"][i]
            }
            layer["metadata"] = fields
        })
        height = map.getCanvas().height
        width = map.getCanvas().width
        bounds = map.getBounds()
        east = bounds.getEast()
        west = bounds.getWest()
        north = bounds.getNorth()
        south = bounds.getSouth()
        coords = [
            [west, north],
            [east, north],
            [east, south],
            [west, south]
            ]
        curUrl = baseUrl+"export?bbox="
        curUrl += west.toFixed(4)+","+south.toFixed(4)+","+east.toFixed(4)+","+north.toFixed(4)
        curUrl += "&bboxSR=4326&imageSR=3857&size="+width+","+height+"&transparent=true&layers=show:"+layer["id"]+"&f=image"
        sourceName = layer['name']+'-source'
        map.addSource(sourceName, {
            type: 'image',
            url: curUrl,
            coordinates: coords
        });
        map.addLayer({
            id: layer['name'],
            'type': 'raster',
            'source': sourceName,
            'layout':{
                'visibility':'none'
            },
            'paint': {
            'raster-fade-duration': 0
            }
        },'neighborhoods-stroke');
        
        addRasterPopupEvent(layer)

        map.on('moveend',function(e){
            for(var i=0;i<mapJson['layers'].length;i++){
                tempLayer = mapJson['layers'][i]
                if(tempLayer.type && tempLayer.type === "raster"){
                    tempSourceName = tempLayer['name']+'-source'
                    updateRaster(tempSourceName)
                }
            }
            
        })
    }

    /*
        update raster layer by source name
    */
    function updateRaster(sourceName){
        height = map.getCanvas().height
        width = map.getCanvas().width
        bounds = map.getBounds()
        east = bounds.getEast()
        west = bounds.getWest()
        north = bounds.getNorth()
        south = bounds.getSouth()
        coords = [
            [west, north],
            [east, north],
            [east, south],
            [west, south]
            ]
        curUrl = baseUrl+"export?bbox="
        curUrl += west.toFixed(4)+","+south.toFixed(4)+","+east.toFixed(4)+","+north.toFixed(4)
        curUrl += "&bboxSR=4326&imageSR=3857&size="+width+","+height+"&transparent=true&layers=show:"+layer["id"]+"&f=image"
        
        map.getSource(sourceName).updateImage({ url: curUrl, coordinates: coords});
    }

    /*
        create map events for mouse enter and leave for a specific layer
    */
    function addMapHoverEvents(layer){
        // Change the cursor to a pointer when the mouse is over the states layer.
        map.on('mouseenter', layer['name'], function () {
            map.getCanvas().style.cursor = 'pointer';
        });
            
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', layer['name'], function () {
            map.getCanvas().style.cursor = '';
        });
    }

    /*
        create map events for popup creation
    */
    function addPopupEvent(layer){

        map.on('click', layer['name'], function (e) {
            popupContent = '<p dir="rtl">'
            feature = e.features[0]
            if('label_field' in layer){
                popupContent += '<table class="popup-table">'
                popupContent += '<tr><th colspan="2">'+feature.properties[layer['label_field']]+"</th></tr>"
                popupContent += "<tr><th>שם שדה</th><th>ערך</th></tr>"
            }else{
                popupContent += '<table class="popup-table">'
                popupContent += "<tr><th>שם שדה</th><th>ערך</th></tr>"
            }
            if('fields' in layer){
                requiredFields = layer['fields']
                if(requiredFields.indexOf('*') > -1){
                    requiredFields = Object.keys(feature.properties)
                }
                for(var i=0; i < requiredFields.length; i++){
                    fieldName = layer["metadata"][requiredFields[i]]["alias"]
                    if(feature.properties[requiredFields[i]] && 
                        (feature.properties[requiredFields[i]].length > 0 
                        && (typeof feature.properties[requiredFields[i]] === "string")   &&
                            feature.properties[requiredFields[i]].trim().length > 0)&&
                        feature.properties[requiredFields[i]] != "null"){
                        popupContent += "<tr><td>"+fieldName+"</td><td>"+feature.properties[requiredFields[i]]+"</td></tr>"
                    }
                }
                popupContent += "</table>"
            }
            popupContent += "</p>"
            popup.setHTML(popupContent)
            popup.setLngLat(e.lngLat)
            popup.addTo(map)
        });

    }

    /*
        create popup event for raster layers
    */
   function addRasterPopupEvent(layer){
    map.on('click', function(e) {
        if(map.getLayoutProperty(layer['name'],'visibility') === "visible"){
            var lngLat = e.lngLat
            var point = turf.point([lngLat.lng,lngLat.lat])
            var buffered = turf.buffer(point, 10, {units: 'meters',steps:4});
            var geom = {"rings":buffered.geometry.coordinates}
            var popUrl = baseUrl+layer["id"]
            popUrl += "/query?where=1=1&geometry="+JSON.stringify(geom)+"&geometryType=esriGeometryPolygon&inSR=4326&spatialRel=esriSpatialRelIntersects"
            popUrl += "&outFields=*&returnGeometry=false&f=geojson"

            fetch(popUrl)
                .then(response => response.json())
                .then(data => {
                    
                    if(data.features &&
                        data.features.length > 0){
                        var popupContent = '<p dir="rtl">'
                        var feature = data.features[0]
                        if('label_field' in layer){
                            popupContent += '<table class="popup-table">'
                            popupContent += '<tr><th colspan="2">'+feature.properties[layer['label_field']]+"</th></tr>"
                            popupContent += "<tr><th>שם שדה</th><th>ערך</th></tr>"
                        }else{
                            popupContent += '<table class="popup-table">'
                            popupContent += "<tr><th>שם שדה</th><th>ערך</th></tr>"
                        }
                        if('fields' in layer){
                            requiredFields = layer['fields']
                            if(requiredFields.indexOf('*') > -1){
                                requiredFields = Object.keys(feature.properties)
                            }
                            for(var i=0; i < requiredFields.length; i++){
                                fieldName = layer["metadata"][requiredFields[i]]["alias"]
                                if(feature.properties[requiredFields[i]] && 
                                    (feature.properties[requiredFields[i]].length > 0 
                                    && (typeof feature.properties[requiredFields[i]] === "string")   &&
                                        feature.properties[requiredFields[i]].trim().length > 0)&&
                                    feature.properties[requiredFields[i]] != "null"){
                                    popupContent += "<tr><td>"+fieldName+"</td><td>"+feature.properties[requiredFields[i]]+"</td></tr>"
                                }
                            }
                            popupContent += "</table>"
                        }
                        popupContent += "</p>"
                        popup.setHTML(popupContent)
                        popup.setLngLat(lngLat)
                        popup.addTo(map)
                        
                    }
                })

            }
        
        });
   }

})();

























