// the plugin adds support for RTL labels 
maplibregl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true // Lazy load the plugin
  );

let baseUrl = "https://gisn.tel-aviv.gov.il/ArcGIS/rest/services/WM/IView2WM/MapServer/"
let map;
let mapJson;
let popup = new maplibregl.Popup()
let neighborhood_url;
let neighborhhod_bounds;

let search = location.search.substring(1);

// load 
fetch("js/IView_style.json")
.then(response => response.json())
.then(style => {
  loadMap(style)
})
function loadMap(loadedStyle){
  map = new maplibregl.Map({
      container: 'gis-map', // container id
      style: loadedStyle,
      animate: false,
      center: [34.789071,32.085432], // starting position
      zoom: 12 // starting zoom
      });
  onMapLoad()
}

function onMapLoad(){
  if(search.length > 1){
      var QS = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
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
        neighborhood_url = `http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/567/query?text=${neighborhood_name}&outFields=*&returnGeometry=true&outSR=4326&f=geojson`
      }
          map.on('load', function () {
              // Add a layer showing the city parks
              fetch(neighborhood_url)
              .then(response => response.json())
              .then(data => {
                  neighborhhod_bounds = data;
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
  
              });
              
              
              
          });
      
      

  }
  map.addControl(mapHeaderControl);
  map.addControl(new maplibregl.NavigationControl());
}




function addButtons(mapJson){
  
  var mapHeader = document.getElementsByClassName('map-header')[0];
  var buttonSpan = document.createElement('span');
  buttonSpan.classList.add('buttons-span')

  buttonDefs = mapJson['buttons']
  for(var i=0;i<buttonDefs.length;i++){
      
      buttonID = 'button-'+i
      mapJson['buttons'][i]['id'] = buttonID
      currentButtonDef = buttonDefs[i]
      layerIDs = currentButtonDef['layers']
      addButtonLayer(layerIDs)
      

      newSpan = document.createElement('span');
      newButton = document.createElement('input');
      newButtonIcon = document.createElement('img');
      newButtonText = document.createElement('span');
      newButton.id = buttonID

      newSpan.classList.add('button-span')
      newButton.type = "checkbox"
      newButton.onchange = function(){

          currentButtonDef = mapJson["buttons"].filter(obj => {
              return obj.id === this.id
            })[0]
          layerIDs = currentButtonDef['layers']
          addButtonLayer(layerIDs,()=>{
              if(this.checked){
                  for(layerI in layerIDs){
                      layerID = layerIDs[layerI]
                      layer = mapJson["layers"].filter(obj => {
                          return obj.id === layerID
                        })[0]
                      map.setLayoutProperty(layer["name"],'visibility','visible')    
                  }
                  
              }else{
                  for(layerI in layerIDs){
                      layerID = layerIDs[layerI]
                      layer = mapJson["layers"].filter(obj => {
                          return obj.id === layerID
                        })[0]
                      map.setLayoutProperty(layer["name"],'visibility','none')    
                  }
              }
          })
      }
      newButtonIcon.src = currentButtonDef['icon']
      newButtonIcon.classList.add('icon')
      newButtonText.innerText = currentButtonDef['label']
      newButtonText.classList.add('button-text')
      newSpan.append(newButton,newButtonIcon,newButtonText)
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

