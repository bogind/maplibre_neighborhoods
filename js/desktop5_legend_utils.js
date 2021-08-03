let LegendBuilder = (function(){

    return {
      addLegend: addLegend,
      updateLegend:updateLegend
    }

    function addLegend(e){
      try{
        e.stopPropagation()
        var legendAddControl = document.getElementById("add-map-legend-button")
        var mapLegendDiv = document.getElementById("map-legend")
        if(map.hasControl(legend)){
          mapLegendDiv.innerHTML = ""
          map.removeControl(legend)
        }else{
          map.addControl(legend)
          legendAddControl.title = "כיבוי מקרא"
          buildIcons(mapJson)
        }
        switchIcon(legendAddControl)
        
      }
      catch (err) {
            console.log(arguments.callee.toString(), err);
      }
    }

    function updateLegend(mapJson){
      var mapLegendDiv = document.getElementById("map-legend")
      if(mapLegendDiv){
        mapLegendDiv.innerHTML = ""
        buildIcons(mapJson)
      }
    }

    function switchIcon(legendAddControl){
      var icon = legendAddControl.children[0].children[0]
      if(legendAddControl.value){
        document.getElementById("add-map-legend-button").value = 0
        icon.className = "fg-map-legend fg-lg"
      }else{
        document.getElementById("add-map-legend-button").value = 1
        icon.className = "fg-map-legend-o fg-lg"
      }
    
    }

    function buildIcons(mapJson){
      var mapLegendDiv = document.getElementById("map-legend")
      var LegendContent = document.createElement('span')
      var layersVisible = 0;
      var opaqueSymbols = 0;
      for(var i=0;i<mapJson.layers.length;i++){
        var layer = mapJson.layers[i]
        if(map.getLayer(layer["name"])){
          var layerShown = map.getLayoutProperty(layer["name"],'visibility')
          if(layerShown === "visible" ){
            layersVisible++
            var layerHeader = document.createElement('h4');
            layerHeader.innerHTML = layer["name_heb"]
            LegendContent.append(layerHeader)
            var layerIconsList = buildLayerIconsList(layer)
            LegendContent.append(layerIconsList)
          }
        }
      }
      if(layersVisible === 0 ){
        var noVisible = document.createElement('span')
        noVisible.innerText = "יש להוסיף שכבות למפה\nבשביל לראות מקרא"
        LegendContent.append(noVisible)
      }
      if(opaqueSymbols){
        var opaqueSymbolsText = document.createElement('b')
        opaqueSymbolsText.innerHTML = "<hr>* שכבה עם שקיפות"
        LegendContent.append(opaqueSymbolsText)
      }
      mapLegendDiv.append(LegendContent)
    }

    function buildLayerIconsList(layer){
      if(layer.symbols && layer.symbols.length > 0){

        var layerList = document.createElement('ul');

        for(var i=0;i<layer.symbols.length;i++){

          if(layer.type && layer.type === "raster"){
            var symbolListItem = document.createElement('li');
            var symbol = layer.symbols[i]
            var icon = buildPointIcon(symbol)
            var iconText = " - ";
            if(symbol.value && symbol.value === "default"){
              if(layer.symbols.length === 1){
                iconText += "כל השכבה"
              }else{
                iconText += symbol.label ? symbol.label : "אחר";
              }
            }else{
              iconText += symbol.label
            }
            symbolListItem.append(icon,iconText)
            layerList.append(symbolListItem)
          }

          if(layer.geomType && layer.geomType === "esriGeometryPolygon"){

            var symbolListItem = document.createElement('li');
            var symbol = layer.symbols[i]
            var icon = buildPolygonIcon(symbol)
            var iconText = "";
            if(symbol.fillOpacity < 1){
              opaqueSymbols = 1;
              iconText += "* - ";
            }else{
              iconText += " - ";
            }
            if(symbol.value && symbol.value === "default"){
              if(layer.symbols.length === 1){
                iconText += "כל הפוליגונים"
              }else{
                iconText += layer["renderer"]["defaultLabel"] ? layer["renderer"]["defaultLabel"] : "אחר";
              }
              
            }else{
              iconText += symbol.label
            }
            symbolListItem.append(icon,iconText)
            layerList.append(symbolListItem)

          }
          else if(layer.geomType && layer.geomType === "esriGeometryPolyline"){

            var symbolListItem = document.createElement('li');
            var symbol = layer.symbols[i]
            var icon = buildLineIcon(symbol)
            var iconText = "";
            if(symbol.lineOpacity < 1){
              opaqueSymbols = 1;
              iconText += "* - ";
            }else{
              iconText += " - ";
            }
            if(symbol.value && symbol.value === "default"){
              if(layer.symbols.length === 1){
                iconText += "כל הקווים"
              }else{
                iconText += layer["renderer"]["defaultLabel"] ? layer["renderer"]["defaultLabel"] : "אחר";
              }
            }else{
              iconText += symbol.label
            }
            symbolListItem.append(icon,iconText)
            layerList.append(symbolListItem)

          }
          else if(layer.geomType && layer.geomType === "esriGeometryPoint"){

            var symbolListItem = document.createElement('li');
            var symbol = layer.symbols[i]
            var icon = buildPointIcon(symbol)
            var iconText = " - ";
            if(symbol.value && symbol.value === "default"){
              if(layer.symbols.length === 1){
                iconText += "כל הנקודות"
              }else{
                iconText += layer["renderer"]["defaultLabel"] ? layer["renderer"]["defaultLabel"] : "אחר";
              }
            }else{
              iconText += symbol.label
            }
            symbolListItem.append(icon,iconText)
            layerList.append(symbolListItem)

          }
        }
        return layerList;
      }
    }

    function buildPointIcon(symbol){
      var icon = document.createElement('img');
      icon.src = symbol.imageData;
      return icon;

    }

    function buildLineIcon(symbol){
      var icon = document.createElement('i');
      icon.className = "fg-polyline fg-2x";
      
      var strokeColor = symbol.strokeColor ? symbol.strokeColor : "#fff";
      var strokeOpacity = symbol.strokeOpacity ? symbol.strokeOpacity : 0.1;
      icon.style.color = strokeColor;
      icon.style.opacity = strokeOpacity;

      return icon;
    }

    function buildPolygonIcon(symbol){
      var icon = document.createElement('i');
      icon.className = "fg-polygon fg-2x";
      
      var fillColor = symbol.fillColor ? symbol.fillColor : "#fff";
      var fillOpacity = symbol.fillOpacity ? symbol.fillOpacity : 0.1;
      icon.style.color = fillColor;
      icon.style.opacity = fillOpacity;

      if(symbol.strokeColor){
        var strokeColor = symbol.strokeColor ? symbol.strokeColor : "#000";
        var strokeWidth = symbol.strokeWidth ? symbol.strokeWidth : 1;
        var textShadow = "-"+strokeWidth+"px -"+strokeWidth+"px 0 "+strokeColor+", ";
        textShadow += ""+strokeWidth+"px -"+strokeWidth+"px 0 "+strokeColor+", ";
        textShadow += "-"+strokeWidth+"px "+strokeWidth+"px 0 "+strokeColor+", ";
        textShadow += ""+strokeWidth+"px "+strokeWidth+"px 0 "+strokeColor;
        icon.style.textShadow = textShadow;
      }
      return icon;
    }

})();