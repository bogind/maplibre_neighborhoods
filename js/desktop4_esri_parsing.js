const labelingPositions = {
    "esriGeometryPoint" :{
        "esriServerPointLabelPlacementAboveCenter":"bottom",
        "esriServerPointLabelPlacementAboveLeft":"bottom-right",
        "esriServerPointLabelPlacementAboveRight":"bottom-left",
        "esriServerPointLabelPlacementBelowCenter":"top",
        "esriServerPointLabelPlacementBelowLeft":"top-right",
        "esriServerPointLabelPlacementBelowRight":"top-left",
        "esriServerPointLabelPlacementCenterCenter":"center",
        "esriServerPointLabelPlacementCenterLeft":"right",
        "esriServerPointLabelPlacementCenterRight":"left"
    },
    "esriGeometryPolyline": {
        "esriServerLinePlacementAboveAfter":"bottom",
        "esriServerLinePlacementAboveAlong":"bottom",
        "esriServerLinePlacementAboveBefore":"bottom",
        "esriServerLinePlacementAboveStart":"bottom",
        "esriServerLinePlacementAboveEnd":"bottom",
        "esriServerLinePlacementBelowAfter":"top",
        "esriServerLinePlacementBelowAlong":"top",
        "esriServerLinePlacementBelowBefore":"top",
        "esriServerLinePlacementBelowStart":"top",
        "esriServerLinePlacementBelowEnd":"top",
        "esriServerLinePlacementCenterAfter":"center",
        "esriServerLinePlacementCenterAlong":"center",
        "esriServerLinePlacementCenterBefore":"center",
        "esriServerLinePlacementCenterStart":"center",
        "esriServerLinePlacementCenterEnd":"center"
    },
    "esriGeometryPolygon": {
        "esriServerPolygonPlacementAlwaysHorizontal":"center"
    }
}
const fakeSource = {
    "type": "FeatureCollection",
    "features": []
  }
const zoomToScale3857 = {
    "0": 559082264,
    "1": 279541132,
    "2": 139770566,
    "3": 69885283,
    "4": 34942641,
    "5": 17471321,
    "6": 8735660,
    "7": 4367830,
    "8": 2183915,
    "9": 1091957.5,
    "10": 545978.75,
    "11": 272989.375,
    "12": 136494.6875,
    "13": 68247.34375,
    "14": 34123.671875,
    "15": 17061.8359375,
    "16": 8530.91796875,
    "17": 4265.458984375,
    "18": 2132.7294921875,
    "19": 1066.36474609375,
    "20": 533.182373046875,
    "21": 266.5911865234375,
    "22": 133.29559326171875,
    "23": 66.64779663085938,
    "24": 33.32389831542969
}
esriRenderer = (function(){

    return {
        getMetadata: getMetadata,
        parseSimpleRenderer: parseSimpleRenderer,
        parseUniqueValueRenderer: parseUniqueValueRenderer,
        loadImage: loadImage,
        updateRaster: updateRaster,
        activateHighlightLayer: activateHighlightLayer
    }

    /*
        get layer metadata (if vector) and start parsing draw info details in the renderer
    */
    function getMetadata(layer){
        try{
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
                    layer["geomType"] = data.geometryType
                    if(data.drawingInfo.labelingInfo && data.drawingInfo.labelingInfo.length > 0){
                        layer["labelingInfo"] = data.drawingInfo.labelingInfo[0]
                    }
                        
                    if(data.drawingInfo && data.drawingInfo.renderer){
                        renderer = data.drawingInfo.renderer
                        layer["renderer"] = renderer
                    }else{
                        console.log(layer)
                    }
                    
        
                    if(renderer.type === "simple"){
                        parseSimpleRenderer(renderer,layer)
                    }else if(renderer.type === "uniqueValue"){
                        parseUniqueValueRenderer(renderer,layer)
                    }
                })
            }
        }
        catch (err) {
            console.log(arguments.callee.toString(), err);
        }
    }

    /*
        activate specific simple renderer function
    */
    function parseSimpleRenderer(renderer,layer){
        try{    
            if(layer["geomType"] === "esriGeometryPoint"){
                return addSimplePointLayer(renderer,layer)
            }else if(layer["geomType"] === "esriGeometryPolygon"){
                return addSimplePolygonLayer(renderer,layer)
            }else if(layer["geomType"] === "esriGeometryPolyline"){
                return addSimpleLineLayer(renderer,layer)
            }else{
                console.log(layer["geomType"])
            }
        }
        catch (err) {
            console.log(arguments.callee.toString(), err);
        }
    }

    /*
        activate specific unique value renderer function
    */
    function parseUniqueValueRenderer(renderer,layer){
        if(layer["geomType"] === "esriGeometryPoint"){
            return parseUniqueValuePoint(renderer,layer)
        }else if(layer["geomType"] === "esriGeometryPolygon"){
            return parseUniqueValuePolygon(renderer,layer)
        }else if(layer["geomType"] === "esriGeometryPolyline"){
            return parseUniqueValueLine(renderer,layer)
        }else{
            console.log(layer["geomType"])
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
                layer["symbols"] = [{
                    "value":"default",
                    "imageData":icon
                }]
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
                if('labelingInfo' in layer){
                    layerJson = addLabels(layer,renderer,layerJson)
                }

                if(!map.hasImage(iconName)){
                    loadImage({"iconName":iconName,"imageData":icon},()=>{
                        if(map.getSource(sourceName) === undefined){
                            map.addSource(sourceName, {
                            type: 'geojson',
                            generateId:true,
                            data: fakeSource
                            });
                            if(map.getLayer(layer['name']) === undefined){
                                map.addLayer(layerJson);
                                addHighlightLayer(layer)
        
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
                            generateId:true,
                            data: layerUrl
                            });
                            if(map.getLayer(layer['name']) === undefined){
                                map.addLayer(layerJson);
                                addHighlightLayer(layer)
        
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
                layer["symbols"] = [
                        {
                        "value":"default",
                        "strokeColor":lineColor,
                        "strokeOpacity":lineOpacity
                    }
                ]
                if('labelingInfo' in layer){
                    layerJson = addLabels(layer,renderer,layerJson)
                }

                if(map.getSource(sourceName) === undefined){
                    map.addSource(sourceName, {
                    type: 'geojson',
                    generateId:true,
                    data: fakeSource
                    });
                    if(map.getLayer(layer['name']) === undefined){
                        map.addLayer(layerJson);
                        addHighlightLayer(layer)

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
                var sourceName =  layer['name']+"-source";
                var layerUrl = utils.getLayerUrl(layer);
                var fillColor = "rgb("+renderer.symbol.color.slice(0,3).join()+")";
                var fillOpacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.symbol.color[3]);
                var strokeLayerName = layer['name']+'-stroke'
                var labelLayerName = layer['name']+'-labels'
                var labelSourceName = layer['name']+"-labels-source";
                var drawOutline = false;
                var drawPolygonLabels = false;
                layer["symbols"] = [
                    {   
                        "value":"default",
                        "fillColor":fillColor,
                        "fillOpacity":fillOpacity
                    }
                ]
                if(renderer.symbol.outline.width > 0.1 || renderer.symbol.outline.color[3] < 1){
                    drawOutline = true;
                    
                    strokeColor = "rgb("+renderer.symbol.outline.color.slice(0,3).join()+")";
                    strokeOpacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.symbol.outline.color[3]);
                    strokeWidth = renderer.symbol.outline.width
                    layer["symbols"][0]["strokeColor"] = strokeColor
                    layer["symbols"][0]["strokeOpacity"] = strokeOpacity
                    layer["symbols"][0]["strokeWidth"] = strokeWidth
                    var strokeLayerJson = {
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
                var layerJson = {
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
                /*
                Add labels source and layer if needed
                */
                if('labelingInfo' in layer){
                    //layerJson = addLabels(layer,renderer,layerJson);
                    drawPolygonLabels = true;
                }

                if(map.getSource(sourceName) === undefined){
                    map.addSource(sourceName, {
                    type: 'geojson',
                    generateId:true,
                    data: fakeSource
                    });
                    if(map.getLayer(layer['name']) === undefined){
                        map.addLayer(layerJson);
                        addHighlightLayer(layer)

                        addPopupEvent(layer)
                            
                        addMapHoverEvents(layer)

                        if(drawOutline && map.getLayer(strokeLayerName) === undefined){
                            map.addLayer(strokeLayerJson);
                        }
                        if(drawPolygonLabels && map.getLayer(labelLayerName) === undefined){
                            addPolygonLabels(layer,renderer,layerUrl,labelLayerName,labelSourceName)
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
        add separate source for polygon labels
    */
    function addPolygonLabels(layer,renderer,layerUrl,labelLayerName,labelSourceName){
        var sourceGeoJson = {
            type: "FeatureCollection",
            features: []
        }
        fetch(layerUrl)
        .then(response => response.json())
        .then(data => {
            sourceGeoJson.crs = data.crs;
            var features = data.features;
            for(var i=0;i<features.length;i++){
                var feature = features[i]
                var newFeature = turf.centroid(feature,{properties:feature.properties})
                sourceGeoJson.features.push(newFeature)
            }
            if(map.getSource(labelSourceName) === undefined){
                map.addSource(labelSourceName, {
                type: 'geojson',
                generateId:true,
                data: sourceGeoJson
                });
                var labelLayerJson = {
                    "id": labelLayerName,
                    "type": "symbol",
                    "source": labelSourceName,
                    "layout": {
                      "icon-image": "שמות מקומות",
                      
                      "text-font": ["Arial Regular"],
                      "text-size": 10.6667,

                      "text-padding":4,
                      "visibility": "none"
                    },
                    "paint": {
                      "icon-color": "rgba(0,0,0,0)",
                      "text-color": "#732600"
                    }
                  }
                labelLayerJson = addLabels(layer,renderer,labelLayerJson);

                map.addLayer(labelLayerJson);
            }

        })
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
            valueInfo.symbol["label"] = valueInfo["label"]
            valueInfo.symbol.imageData = "data:image/png;base64,"+valueInfo.symbol.imageData
            symbols[valueInfo.value] = valueInfo.symbol
            loadImage({"iconName":valueInfo.symbol.iconName,"imageData":valueInfo.symbol.imageData})
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
    function loadImage(params,_callback){
        params.pixelRatio = params.pixelRatio || 1;
        map.loadImage(params.imageData, function(error, image) {
            if (error) throw error;
            
            if(map.hasImage(params.iconName)){
                
            }else{
                map.addImage(params.iconName, image,{pixelRatio:params.pixelRatio});
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

        var sourceName =  layer['name']+"-source"
        if(renderer.field2){
            if(renderer.field3){
                var valueField1 = renderer.field1
                var valueField2 = renderer.field2
                var valueField3 = renderer.field3
                var deleimiter = renderer.fieldDelimiter
                var iconExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2],deleimiter,["get",valueField3]]]
            }else{
                var valueField1 = renderer.field1
                var valueField2 = renderer.field2
                var deleimiter = renderer.fieldDelimiter
                var iconExpression = ["match",["concat",["get",valueField1],deleimiter,["get",valueField2]]]
            }
        }else{
            var valueField = renderer.field1
            var iconExpression = ["match",["get",valueField]]
        }
        layerUrl = utils.getLayerUrl(layer)
        //iconImage = ["match",["get",valueField]]
        values = Object.keys(symbols)
        layer["symbols"] = []
        for(var i=0;i<values.length;i++){
            iconExpression.push([values[i]],symbols[values[i]].iconName)
            layer["symbols"].push({"value":values[i],"imageData":symbols[values[i]].imageData,"label":symbols[values[i]].label})
        }
        iconExpression.push(symbols["default"]["iconName"])
        layerJson = {
            'id': layer["name"],
            'type': 'symbol',
            'source': sourceName,
            'layout': {
            'icon-image':iconExpression,
            'icon-allow-overlap':true,
            'visibility': 'none'
            },
            'paint':{

            }
        }
        if('labelingInfo' in layer){
            layerJson = addLabels(layer,renderer,layerJson)
        }



        if(map.getSource(sourceName) === undefined){
            map.addSource(sourceName, {
            type: 'geojson',
            generateId:true,
            data: fakeSource
            });
            if(map.getLayer(layer['name']) === undefined){
                map.addLayer(layerJson);
                addHighlightLayer(layer)

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

        layer["symbols"] = []
        for(var i=0;i<renderer.uniqueValueInfos.length;i++){
            value = renderer.uniqueValueInfos[i].value
            label = renderer.uniqueValueInfos[i].label
            color = "rgb("+renderer.uniqueValueInfos[i].symbol.color.slice(0,3).join()+")";
            opacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.uniqueValueInfos[i].symbol.color[3]);
            width = renderer.uniqueValueInfos[i].symbol.width ? renderer.uniqueValueInfos[i].symbol.width : 1;
            colorExpression.push(value,color)
            opacityExpression.push(value,opacity)
            widthExpression.push(value,width)
            layer["symbols"].push({
                "label":label,
                "value":value,
                "strokeColor":color,
                "strokeOpacity":opacity
            })

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
        if('labelingInfo' in layer){
            layerJson = addLabels(layer,renderer,layerJson)
        }

        if(map.getSource(sourceName) === undefined){
            map.addSource(sourceName, {
            type: 'geojson',
            generateId:true,
            data: fakeSource
            });
            if(map.getLayer(layer['name']) === undefined){
                map.addLayer(layerJson);
                addHighlightLayer(layer)

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
            
        var sourceName =  layer['name']+"-source"
        var layerUrl = utils.getLayerUrl(layer)
        var strokeLayerName = layer['name']+'-stroke'
        var labelLayerName = layer['name']+'-labels'
        var labelSourceName = layer['name']+"-labels-source";
        var drawOutline = false;
        var drawPolygonLabels = false;
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

        layer["symbols"] = []
        for(var i=0;i<renderer.uniqueValueInfos.length;i++){
            var value = renderer.uniqueValueInfos[i].value
            var label = renderer.uniqueValueInfos[i].label
            var color = "rgb("+renderer.uniqueValueInfos[i].symbol.color.slice(0,3).join()+")";
            var opacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.uniqueValueInfos[i].symbol.color[3]);
            colorExpression.push(value,color)
            opacityExpression.push(value,opacity)
            var symbol = {
                "label":label,
                "value":value,
                "fillColor":color,
                "fillOpacity":opacity
            }
            if(renderer.uniqueValueInfos[i].symbol.outline.width < 0.1 || renderer.uniqueValueInfos[i].symbol.outline.color[3] < 1){
                var strokeColor = "rgb("+renderer.uniqueValueInfos[i].symbol.outline.color.slice(0,3).join()+")";
                var strokeOpacity = layer["opacity"] ? layer["opacity"] : utils.parseOpacity(renderer.uniqueValueInfos[i].symbol.outline.color[3]);
                var strokeWidth = renderer.uniqueValueInfos[i].symbol.outline.width
                symbol["strokeColor"] = strokeColor
                symbol["strokeOpacity"] = strokeOpacity
                symbol["strokeWidth"] = strokeWidth
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
            }
            layer["symbols"].push(symbol)

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
        /*
        Add labels source and layer if needed
        */
        if('labelingInfo' in layer){
            //layerJson = addLabels(layer,renderer,layerJson);
            drawPolygonLabels = true;
        }

        if(map.getSource(sourceName) === undefined){
            map.addSource(sourceName, {
            type: 'geojson',
            generateId:true,
            data: fakeSource
            });
            if(map.getLayer(layer['name']) === undefined){
                map.addLayer(layerJson);
                addHighlightLayer(layer)

                addPopupEvent(layer)
                    
                addMapHoverEvents(layer)
                if(drawOutline && map.getLayer(strokeLayerName) === undefined){
                    map.addLayer(strokeLayerJson);
                }
                if(drawPolygonLabels && map.getLayer(labelLayerName) === undefined){
                    addPolygonLabels(layer,renderer,layerUrl,labelLayerName,labelSourceName)
                }

            }else{
                return
            }
        }else{
            return
            
        }

    }

   /*
        create secondary layer from source to highlight
   */
   function addHighlightLayer(layer){
        let geomType = layer.geomType;
        let highlightLayerName = layer['name']+'-highlight'
        let sourceName = layer['name']+'-source'
        try{    
            if(geomType === "esriGeometryPoint"){

                highLightLayerJson = {
                    'id': highlightLayerName,
                    'type': 'circle',
                    'source': sourceName,
                    'paint':{
                        'circle-radius': 16,
                        'circle-opacity': 0,
                        'circle-stroke-color':"#4cd4ea",
                        'circle-stroke-width':4,
                        'circle-stroke-opacity': ['case',
                        ['boolean', ['feature-state', 'hover'], false],1,
                        ['boolean', ['feature-state', 'clicked'], false],1,0]
                    }
                }

            }else if(geomType === "esriGeometryPolygon"){

                highLightLayerJson = {
                    'id': highlightLayerName,
                    'type': 'line',
                    'source': sourceName,
                    'paint':{
                        'line-width': 6,
                        'line-color':"#4cd4ea",
                        'line-opacity': ['case',
                        ['boolean', ['feature-state', 'hover'], false],1,
                        ['boolean', ['feature-state', 'clicked'], false],1,0]
                    }
                }
                
            }else if(geomType === "esriGeometryPolyline"){
                
                highLightLayerJson = {
                    'id': highlightLayerName,
                    'type': 'line',
                    'source': sourceName,
                    'paint':{
                        'line-width': 6,
                        'line-color':"#4cd4ea",
                        'line-opacity': ['case',
                        ['boolean', ['feature-state', 'hover'], false],1,
                        ['boolean', ['feature-state', 'clicked'], false],1,0]
                    }
                }

            }else{
                console.log(geomType)
            }
            map.addLayer(highLightLayerJson);
        }
        catch (err) {
            console.log(arguments.callee.toString(), err);
        }
   }

    /*
        add map events to change feature states so highlight layer will show
   */
    function activateHighlightLayer(layer){
        
        //let hoveredStateId
        map.on('mousemove',  layer['name'], highlightMouseMove);
            
            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
        map.on('mouseleave',  layer['name'], function(){
            let sourceName = layer['name']+'-source';
            if (hoveredStateId) {
                map.setFeatureState(
                    { source: sourceName, id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = null;
        });
    }
   

   function highlightMouseMove(e){
    
        if (e.features.length > 0) {
            let layer = e.features[0].layer
            let sourceName = layer['id']+'-source';
                    
            if (hoveredStateId) {
                map.setFeatureState(
                    { source: sourceName, id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = e.features[0].id;
            
            map.setFeatureState(
                { source: sourceName, id: hoveredStateId },
                { hover: true }
            );
        }
    }
    activateHighlightLayer(layer)

   function highlightMouseOut(e){
    
        let sourceName = layer['name']+'-source';
        if (hoveredStateId) {
            map.setFeatureState(
                { source: sourceName, id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = null;
    }
    activateHighlightLayer(layer)

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
            getRasterLegend(layer)
        })
        canvas = map.getCanvas()
        height = canvas.height
        width = canvas.width
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
        curUrl += west.toFixed(5)+","+south.toFixed(5)+","+east.toFixed(5)+","+north.toFixed(5)
        curUrl += "&bboxSR=4326&imageSR=3857&size="+width+","+height+"&transparent=true&layers=show:"+layer["id"]+"&f=image"
        sourceName = layer['name']+'-source'
        map.addSource(sourceName, {
            type: 'image',
            url: curUrl,
            coordinates: coords
        });
        if(map.getLayer('neighborhoods-stroke')){
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
        }else{
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
            });
        }
        
        
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
        Get Legend Icons for Raster Layer
    */
    function getRasterLegend(layer){
        var legendUrl = baseUrl+ 'legend?dynamicLayers=[{"id":1,"source":{"type":"mapLayer","mapLayerId":'+layer["id"]+'}}]&f=json'
        var symbols = []
        fetch(legendUrl)
        .then(response => response.json())
        .then(data => {
            var legend = data["layers"][0]["legend"];
            for(var i=0;i<legend.length;i++){
                symbol = {
                    "label": legend[i].label,
                    "imageData":"data:image/png;base64,"+legend[i].imageData,
                    "value":legend[i].values ? legend[i].values[0] : "default"
                };
                symbols.push(symbol);
            }
            layer["symbols"] = symbols;
        })
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
                    fieldType = layer["metadata"][requiredFields[i]]["type"]
                    if(feature.properties[requiredFields[i]] && 
                        feature.properties[requiredFields[i]] != "null"){
                        if(fieldType === "esriFieldTypeDate"){
                            dateString = new Date(feature.properties[requiredFields[i]]).toLocaleString("he-IL")
                            popupContent += "<tr><td>"+fieldName+"</td><td>"+dateString+"</td></tr>"    
                        }else{
                            popupContent += "<tr><td>"+fieldName+"</td><td>"+feature.properties[requiredFields[i]]+"</td></tr>"
                        }
                        
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

   /*
   */
   function addLabels(layer,renderer,layerJson){
       try{
        var labelingInfo = layer["labelingInfo"]
        var offsetX = labelingInfo["symbol"]["xoffset"] ? labelingInfo["symbol"]["xoffset"] : 0;
        var offsetY = labelingInfo["symbol"]["yoffset"] ? labelingInfo["symbol"]["yoffset"] : 0;
        var fontSize = labelingInfo["symbol"]["font"]["size"] ? labelingInfo["symbol"]["font"]["size"] : 10;
        var textColor = labelingInfo["symbol"]["color"] ? "rgb("+labelingInfo["symbol"]["color"].slice(0,3).join()+")" : "#000000";
        var labelPosition = getLabelTextPosition(layer,labelingInfo)
        //utils.parseOpacity(renderer.defaultSymbol.color[3])

        layerJson['layout']['text-field'] = getLabelExpression(labelingInfo)
        layerJson['layout']['text-anchor'] = labelPosition;
        layerJson['layout']['text-offset'] = adjustOffset(labelPosition,offsetX,offsetY)
        layerJson['layout']['text-justify'] = 'auto'
        layerJson['layout']['text-size'] = fontSize
        layerJson['layout']['text-font'] = ["Arial Regular"]
        layerJson['paint']['text-color'] = textColor
        layerJson['paint']['text-opacity'] = getTextOpacity(labelingInfo)

        if(labelingInfo["symbol"]["haloColor"]){
            var haloColor = labelingInfo["symbol"]["haloColor"] ? "rgb("+labelingInfo["symbol"]["haloColor"].slice(0,3).join()+")" : "#ffffff";
            var haloWidth = labelingInfo["symbol"]["haloSize"] ? labelingInfo["symbol"]["haloSize"] : 1;
            layerJson['paint']['text-halo-color'] = haloColor;
            layerJson['paint']['text-halo-width'] = haloWidth;
        }
    
        return layerJson
       }
       catch (err) {
        console.log(layer)
        console.log(arguments.callee.toString(), err);
    }
        
   }


   function getTextOpacity(labelingInfo){
       try {
        let textOpacity = 1;   
        
        
        if('maxScale' in labelingInfo){
            maxZoom = labelingInfo['maxScale'] > 0 ? getZoomFromScale(labelingInfo['maxScale']) : 24
        }
        if('minScale' in labelingInfo){
            minZoom = labelingInfo['minScale'] > 0 ? getZoomFromScale(labelingInfo['minScale']) : 0
        }
        minZoom = minZoom+0.1
            textOpacity = ["step",
                ["zoom"],
                0,
                minZoom,
                1,
                maxZoom,
                1
            ]

        
        
        return textOpacity;
       } catch (error) {
           
       }
       
   }

   function getZoomFromScale(scale){
        
        let outZoom = 25
       for(var i=0;i<25;i++){
            if(scale > zoomToScale3857[i]){
                outZoom = i;
                break;
            }
       }
       return outZoom;
   }

   /*
        convert esri position name to mapbox position name
   */
   function getLabelTextPosition(layer,labelingInfo){
       try{
            return labelingPositions[layer["geomType"]][labelingInfo["labelPlacement"]]
       }
       catch (err) {
            console.log(arguments.callee.toString(), err);
    }
        
   }

   /* 
        adjust offset in case no offset is added
   */
    function adjustOffset(labelPosition,offsetX,offsetY){
        try{
            var offsetArray;
            if(labelPosition === "center"){
                offsetArray = [offsetX,offsetY]
            }else{
                if(offsetY == 0){
                    if(labelPosition.startsWith("bottom")){
                        offsetY = -1
                    }else if(labelPosition.startsWith("top")){
                        offsetY = 1
                    }
                }
                if(offsetX == 0){
                    if(labelPosition.startsWith("right") || labelPosition.endsWith("right")){
                        offsetX = -1
                    }else if(labelPosition.startsWith("left") || labelPosition.endsWith("left")){
                        offsetX = 1
                    }
                }
                offsetArray = [offsetX,offsetY]
            }
            return offsetArray
        }
        catch (err) {
            console.log(arguments.callee.toString(), err);
        }
    }


    /*
        convert esri expression to mapbox label expression
    */
    function getLabelExpression(labelingInfo){
            try{
                var labelExpression = labelingInfo["labelExpression"];
                var parts = labelExpression.split("CONCAT");
                var baseExpression;
                if(parts.length === 1){
                    var fieldName = parts[0].substring(1,parts[0].length-1);
                    baseExpression = ['get',fieldName];
                }else{
                    parts = parts.map(x => x.trim())
                    parts = parts.map(x => x.replaceAll('"',''))
                    baseExpression = ["concat"];
                    for(var i=0;i<parts.length;i++){
                        var part = parts[i];
                        if(part.startsWith("[") && part.endsWith("]")){
                            var fieldName = part.substring(1,part.length-1);
                            baseExpression.push( ['get',fieldName]);
                        }else if(part === "NEWLINE"){
                            baseExpression.push("\n");
                        }else if(part.startsWith("ROUND")){
                            var roundparts = part.split(',')
                            if(roundparts.length > 1){
                                part = roundparts[0].split("ROUND(")[1]
                                var fieldName = part.substring(1,part.length-1);
                                baseExpression.push( ["round",['get',fieldName]]);
                            }
                        }else{
                            baseExpression.push(part);
                        }
                    }
                }
                return baseExpression;
            }
            catch (err) {
                console.log(arguments.callee.toString(), err);
            }
    }

})();

























