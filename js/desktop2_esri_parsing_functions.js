layer = {
    "id":553,
    "name":"mosdot_kehila",
    "name_heb":"מוסדות קהילה",
    "fields":["shem"],
    "label_field":["shem"]
}
layer2 = {
    "id":842,
    "name":"parks1",
    "name_heb":"גנים ציבוריים",
    "opacity": 0.8
}
layer3 = {
    "id":917,
    "name":"inf_works",
    "name_heb":"עבודות תשתית בתוקף-פנימי",
    "fields":["*"],
    "type":"raster"
}
layer4 = {
    "id":635,
    "name":"library1",
    "name_heb":"ספריות חוץ",
    "fields":["sug","mikum","moadei_peilut","sheat_sippur","contact_person","merchav_kehila","achrayut"],
    "label_field":["sug"]
}
button = {
    "layers":[553],
    "label":"מוסדות\nקהילה",
    "icon":"icons/community_icon.svg"
}

function getMetadata(layer){
    if(layer.type && layer.type === "raster"){
        addRasterLayer(layer)
    }else{
        url = "http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/"+layer["id"]+"?f=pjson"
        fetch(url)
        .then(response => response.json())
        .then(data => {
            
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

function getLayerUrl(layer){
    baseUrl = "http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/"+layer["id"]
    baseUrl += "/query?where=1%3D1&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson"
    baseUrl += "&inSR=4326&geometryType=esriGeometryEnvelope&geometry="+turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))
    if('fields' in layer){
        fields = layer['fields']
        if('label_field' in layer){
            fields = fields.concat(layer['label_field'])
        }
        baseUrl += "&outFields="+fields.join()
    }else{
        baseUrl += "&outFields="
    }
    return baseUrl
}

function parseSimpleRenderer(geomType,renderer,layer){
    if(geomType === "esriGeometryPoint"){
        return parseSimplePoint(renderer,layer)
    }else if(geomType === "esriGeometryPolygon"){
        return parseSimplePolygon(renderer,layer)
    }else{
        console.log(geomType)
    }
}

function parseUniqueValueRenderer(geomType,renderer,layer){
    if(geomType === "esriGeometryPoint"){
        return parseUniqueValuePoint(renderer,layer)
    }else if(geomType === "esriGeometryPolygon"){
        return parseUniqueValuePolygon(renderer,layer)
    }else{
        console.log(geomType)
    }
}

function parseSimplePoint(renderer,layer){
    // simple Picture Marker Symbol
    if(renderer.symbol && 
        renderer.symbol.type === "esriPMS"){
            icon = "data:image/png;base64,"+renderer.symbol.imageData
            iconName = layer['name']+'Icon'
            sourceName =  layer['name']+"-source"
            layerUrl = getLayerUrl(layer)

            layerJson = {
                'id': layer['name'],
                'type': 'symbol',
                'source': sourceName,
                'layout': {
                  'icon-image':iconName,
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
                layerJson['paint']['text-halo-width'] = "1.33333"
            }

            if(!map.hasImage(iconName)){
                map.loadImage(icon, function(error, image) {
                  if (error) throw error;
                  
                  map.addImage(iconName, image);
                  if(map.getSource(sourceName) === undefined){
                    map.addSource(sourceName, {
                      type: 'geojson',
                      data: layerUrl
                      });
                      if(map.getLayer(layer['name']) === undefined){
                        map.addLayer(layerJson);
                      }else{
                        return
                      }
                  }else{
                    return
                    
                  }
              
                  });
                }

    }
}

function parseSimplePolygon(renderer,layer){
    // Simple Fill Symbol
    if(renderer.symbol && 
        renderer.symbol.style === "esriSLSSolid"){
            sourceName =  layer['name']+"-source";
            layerUrl = getLayerUrl(layer);
            fillColor = "rgb("+renderer.symbol.color.slice(0,3).join()+")";
            fillOpacity = layer["opacity"] ? layer["opacity"] : parseOpacity(renderer.symbol.color[3]);
            strokeLayerName = layer['name']+'-stroke'
            if(renderer.symbol.outline.width < 0.1 || renderer.symbol.outline.color[3] < 1){
                drawOutline = true;
                
                strokeColor = "rgb("+renderer.symbol.outline.color.slice(0,3).join()+")";
                strokeOpacity = layer["opacity"] ? layer["opacity"] : parseOpacity(renderer.symbol.outline.color[3]);
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
        layerUrl = getLayerUrl(layer);
    }
}

function parseUniqueValuePoint(renderer,layer){
    if(renderer.defaultSymbol.type &&
     renderer.defaultSymbol.type === "esriPMS"){
        loadMultipleImages(renderer,layer)
     }
}

function loadMultipleImages(renderer,layer){
    symbols = {}
    renderer.defaultSymbol["iconName"] = layer["name"]+"-defaultIcon"
    renderer.defaultSymbol.imageData = "data:image/png;base64,"+renderer.defaultSymbol.imageData
    symbols["default"] = renderer.defaultSymbol
    if(!map.hasImage(renderer.defaultSymbol["iconName"])){
        
        map.loadImage(renderer.defaultSymbol.imageData, function(error, image) {
          if (error) throw error;
          map.addImage(renderer.defaultSymbol["iconName"], image);
        })
    }
    for(var i = 0; i< renderer.uniqueValueInfos.length;i++){
        valueInfo = renderer.uniqueValueInfos[i]
        valueInfo.symbol["iconName"] = layer["name"]+"-Icon"+(i+1)
        valueInfo.symbol.imageData = "data:image/png;base64,"+valueInfo.symbol.imageData
        symbols[valueInfo.value] = valueInfo.symbol
        loadImage(valueInfo.symbol.iconName,valueInfo.symbol.imageData)
            
        
    }

    loadUniqueValuePMSPoint(renderer,layer,symbols)
}
function loadImage(iconName,imageData){
    map.loadImage(imageData, function(error, image) {
        if (error) throw error;
        console.log(iconName,map.hasImage(iconName))
        if(map.hasImage(iconName)){
            
        }else{
            map.addImage(iconName, image);
        }
      })
}

function loadUniqueValuePMSPoint(renderer,layer,symbols){

    sourceName =  layer['name']+"-source"
    valueField = renderer.field1
    layerUrl = getLayerUrl(layer)
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
          'visibility': 'visible'
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
          }else{
            return
          }
      }else{
        return
        
      }
}

function addVectorLayer(layer){
    fetch("http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/"+layer["id"]+"?f=json")
    .then(response => response.json())
    .then(data => {
        fields = {}
        for(var i =0;i< data["fields"].length;i++){
            fieldName = data["fields"][i]["name"]
            fields[fieldName] = data["fields"][i]
        }
        layer["metadata"] = fields

    })
}

function addRasterLayer(layer){
    fetch("http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/"+layer["id"]+"?f=json")
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
    curUrl = "http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/export?bbox="
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
        'paint': {
        'raster-fade-duration': 0
        }
    });
    map.on('click', function(e) {
        lngLat = e.lngLat
        popUrl = "http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/"+layer["id"]
        popUrl += "/query?where=1=1&geometry="+lngLat.lng+","+lngLat.lat+"&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects"
        popUrl += "&outFields=*&returnGeometry=false&f=geojson"

        fetch(popUrl)
            .then(response => response.json())
            .then(data => {
                
                if(data.features.length > 0){
                    popupContent = '<p dir="rtl">'
                    feature = data.features[0]
                    if('label_field' in layer){
                        popupContent += "<h3>"+feature.properties[layer['label_field']]+"</h3>"
                    }
                    if('fields' in layer){
                        requiredFields = layer['fields']
                        if(requiredFields.indexOf('*') > -1){
                            requiredFields = Object.keys(feature.properties)
                        }
                        for(var i=0; i < requiredFields.length; i++){
                            fieldName = layer["metadata"][requiredFields[i]]["alias"]
                            popupContent += "<b><u>"+fieldName+"</u></b>: "+feature.properties[requiredFields[i]]+"<br>"
                        }
                    }
                    popupContent += "</p>"
                    popup.setHTML(popupContent)
                    popup.setLngLat(lngLat)
                    popup.addTo(map)
                    
                }
            })
        });
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