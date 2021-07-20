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
button = {
    "layers":[553],
    "label":"מוסדות\nקהילה",
    "icon":"icons/community_icon.svg"
}

function getMetadata(layer){
    url = "http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/"+layer["id"]+"?f=pjson"
    fetch(url)
    .then(response => response.json())
    .then(data => function(data){
        
        geomType = data.geometryType
        renderer = data.drawingInfo.renderer
        console.log(renderer)
        if(renderer.type === "simple"){
          //parseSimpleRenderer(geomType,renderer,layer)
        }
    })
}

function getLayerUrl(layer){
    baseUrl = "http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/"+layer["id"]
    baseUrl += "/query?where=1%3D1&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson"
    if('fields' in layer){
        fields = layer['fields']
        if('label_field' in layer){
            fields = fields.concat(layer['label_field'])
        }
        baseUrl += "&outFields="+fields.join()
    }else{
        baseUrl += "&outFields="
    }
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
        renderer.symbol.type === "esriSFS"){
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