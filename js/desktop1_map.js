// the plugin adds support for RTL labels 
maplibregl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true // Lazy load the plugin
  );

const baseUrl = "https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/"
// innerUrl = "https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/"
// outerUrl = "https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/"
const cityBorderUrl = "https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/890/query?where=1%3D1&outFields=Shape&geometryPrecision=6&outSR=4326&returnExtentOnly=true&f=geojson"
let baseStyle;
let QS;
let map;
let mapJson;
let popup = new maplibregl.Popup()
let neighborhood_url;
let neighborhhod_bounds;
let current_bounds;
let city_bounds;

let search = location.search.substring(1);

// load style for basemap
fetch("js/IView_style.json")
//fetch("js/IView_agol_style.json")
.then(response => response.json())
.then(style => {
  baseStyle = style;
    loadMap(baseStyle)
})

function loadMap(loadedStyle){
  map = new maplibregl.Map({
      container: 'gis-map', // container id
      style: loadedStyle,
      dragRotate: false,
      animate: false,
      center: [34.789071,32.085432], // starting position
      zoom: 12 // starting zoom
      });
  onMapLoad()
}

function onMapLoad(){
  if(search.length > 1){
      QS = utils.getParamsFromUrl(decodeURI(location))
      
      createFilter(QS)
        map.on('load', function () {
            
            if(neighborhood_url){
            fetch(neighborhood_url)
            .then(response => response.json())
            .then(data => {
                neighborhhod_bounds = data;
                current_bounds = neighborhhod_bounds;
                topHeight = document.getElementsByClassName('map-header')[0].clientHeight
                topPadding = topHeight+30
                map.fitBounds(turf.bbox(neighborhhod_bounds), {
                    padding: {top: topPadding, bottom:20, left: 20, right: 20},
                    linear:true
                    })
                      

                // Set data source that noth layers use
                map.addSource('neighborhood', {
                      'type': 'geojson',
                      'data': data
                    })
                // add polygon layers
                map.addLayer({
                    'id': 'neighborhoods',
                    'type': 'fill',
                    'source': 'neighborhood',
                    'paint': {
                        'fill-color': 'rgba(200, 100, 240, 0)',
                        'fill-outline-color': 'rgba(200, 100, 240, 1)'
                    }
                },"מנהרות/label/ברירת מחדל");
                // add line layer for thicker stroke
                map.addLayer({
                  'id': 'neighborhoods-stroke',
                  'type': 'line',
                  'source': 'neighborhood',
                  'paint': {
                      'line-color': 'rgba(200, 100, 240, 1)',
                      'line-width': 4
                  }
              },'neighborhoods');
              
                
            }).then(function(){
              parseMap(QS)
            });
          }else{
            fetch(cityBorderUrl)
            .then(response => response.json())
            .then(data => {
                city_bounds = data;
                current_bounds = turf.bboxPolygon(city_bounds.extent.bbox);
            }).then(() =>{
              parseMap(QS)
            })
          }
              
            
              
              
          });
      
      

  }
  map.addControl(mapHeaderControl);
  map.addControl(new maplibregl.NavigationControl());
  map.addControl(legendAdd)
  /*
  still needs a way to reload all layers for the new extent.
  map.addControl(changeBounds)
  */
}

function createFilter(QS){
  if("ne" in QS){
    var neighborhood_code = parseInt(QS.ne)
    neighborhood_url = baseUrl+"511/query?where=oid_shchuna="
    neighborhood_url += neighborhood_code+"&outFields=*&returnGeometry=true&outSR=4326&f=geojson"
  }else if("shemShchuna" in QS){
    var neighborhood_name = QS.shemShchuna
    neighborhood_url =  baseUrl+"511/query?text="
    neighborhood_url += neighborhood_name+"&outFields=*&returnGeometry=true&outSR=4326&f=geojson"
  }else if("AreaName" in QS){
    var neighborhood_name = QS.AreaName
    neighborhood_url = baseUrl+`/567/query?text=${neighborhood_name}&outFields=*&returnGeometry=true&outSR=4326&f=geojson`
  }
}

function parseMap(QS){
    if("map" in QS){
      jsonUrl = QS["map"]+".json"
    }else{
        jsonUrl = "AreaProfile.json"
    }
    fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
        mapJson = data
        addButtons(mapJson)
    })

}


function addButtons(mapJson){
  
  var mapHeader = document.getElementsByClassName('map-header')[0];
  var buttonSpan = document.createElement('span');
  buttonSpan.classList.add('buttons-span')

  buttonDefs = mapJson['buttons']
  for(var i=0;i<buttonDefs.length;i++){
      
      var buttonID = 'button-'+i
      mapJson['buttons'][i]['id'] = buttonID
      var currentButtonDef = buttonDefs[i]
      var layerIDs = currentButtonDef['layers']
      addButtonLayer(layerIDs)
      

      var newSpan = document.createElement('span');
      var newButton = document.createElement('button');
      var newButtonIcon = document.createElement('img');
      var newButtonText = document.createElement('span');
      newButton.className = "button"
      newButton.id = buttonID

      newSpan.classList.add('button-span');
      newButton.type = "button";
      newButton.value = 0;
      newButton.onclick = function(){
          currentButtonDef = mapJson["buttons"].filter(obj => {
              return obj.id === this.id
            })[0]
          layerIDs = currentButtonDef['layers']
          addButtonLayer(layerIDs,()=>{
              if(this.value === "0"){
                this.value = "1"
                this.className = "button-on"
                  for(layerI in layerIDs){
                      layerID = layerIDs[layerI]
                      layer = mapJson["layers"].filter(obj => {
                          return obj.id === layerID
                        })[0]
                      map.setLayoutProperty(layer["name"],'visibility','visible')  
                      strokeLayerName = layer['name']+'-stroke'
                      labelLayerName = layer['name']+'-labels'
                      if(neighborhood_url){}else{
                        sourceName =  layer['name']+"-source"
                        
                        current_bounds = utils.updateCurrentBounds(map)
                        currentLayerUrl = utils.getLayerUrl(layer)
                        map.getSource(sourceName).setData(currentLayerUrl)
                      }
                      if(map.getLayer(strokeLayerName) !== undefined){
                        map.setLayoutProperty(strokeLayerName,'visibility','visible')  
                      }  
                      if(map.getLayer(labelLayerName) !== undefined){
                        map.setLayoutProperty(labelLayerName,'visibility','visible')  
                      }
                      if(layer["type"] && layer["type"] === "raster"){
                        sourceName = layer['name']+'-source'
                        esriRenderer.updateRaster(sourceName)
                        
                      }
                  }
                  
              }else{
                this.value = "0"
                this.className = "button"
                  for(layerI in layerIDs){
                      layerID = layerIDs[layerI]
                      layer = mapJson["layers"].filter(obj => {
                          return obj.id === layerID
                        })[0]
                      map.setLayoutProperty(layer["name"],'visibility','none')  
                      strokeLayerName = layer['name']+'-stroke'
                      labelLayerName = layer['name']+'-labels'
                      if(map.getLayer(strokeLayerName) !== undefined){
                        map.setLayoutProperty(strokeLayerName,'visibility','none')  
                      }  
                      if(map.getLayer(labelLayerName) !== undefined){
                        map.setLayoutProperty(labelLayerName,'visibility','none')  
                      }  
                  }
              }
              LegendBuilder.updateLegend(mapJson)
          })
      }
      var b = document.createElement('b')
      b.innerText = currentButtonDef['label']+" "
      newButtonIcon.src = currentButtonDef['icon']
      newButtonIcon.classList.add('icon')
      newButtonText.innerText = currentButtonDef['label']
      newButtonText.classList.add('button-text')
      newButton.append(newButtonText,newButtonIcon)
      newSpan.append(newButton)
      buttonSpan.append(newSpan)
  }
  mapHeader.append(buttonSpan)

}
function addButtonLayer(layerIDs,_callback){
  
  for(var i=0;i<layerIDs.length;i++){
      id = layerIDs[i]
      
      layer = utils.getLayer(id)
      
      if(map.getLayer(layer['name']) === undefined){
		    esriRenderer.getMetadata(layer)
      }
  }
  if (_callback) {
      _callback();
  }
}

const mapHeaderControl = new MapHeader();
const legendAdd = new MapLegendButton();
const legend = new MapLegend();
const changeBounds = new MapChangeBoundsButton();

