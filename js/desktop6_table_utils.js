let tableBuilder = (function(){

    return {
      addTables: addTables,
      buildTable: buildTable,
      toggleTableTab:toggleTableTab
    }

    function addTables(e){
        try{
          e.stopPropagation()
          var tableAddControl = document.getElementById("add-map-table-button")
          var mapTableDiv = document.getElementById("map-table-container")
          if(map.hasControl(tables)){
            mapTableDiv.innerHTML = ""
            map.removeControl(tables)
          }else{
            map.addControl(tables,'top-left')
            tableAddControl.title = "הסתרת טבלאות"
            //buildIcons(mapJson)
          }
          //switchIcon(tableAddControl)
          
        }
        catch (err) {
              console.log(arguments.callee.toString(), err);
        }
      }

    function buildTable(layer,opts={}){
        let table = document.createElement("table");

        let source = map.getSource(`${layer.name}-source`);
        let data = source.serialize().data;
        let features = data.features;
        let fieldNames = Object.keys(features[0].properties);
        let headerRow = document.createElement('tr');
        table.append(headerRow)
        fieldNames.forEach(element => {
          let th = document.createElement('th');
          let alias = layer.metadata[element].alias || layer.metadata[element].name;
          th.innerText = alias
          headerRow.append(th)
        })
        let ID = 0;
        features.forEach(element => {
            
            let tr = document.createElement('tr');
            tr.value = {source:`${layer.name}-source`,id:ID}
            tr.onclick = tableRowClick;
            tr.onmouseover = tableRowOver;
            tr.onmouseleave = tableRowLeave;
            Object.values(element.properties).forEach(property => {
              let td = document.createElement('td');
              td.innerText = property
              tr.append(td)
            })
            //td.innerHTML = JSON.stringify(element.properties)
            
            table.append(tr)
            ID += 1;
        });
        return table
    }

    function tableRowClick(evt){
      try {
        let rowData;
      if(evt.target.tagName == "TR"){
        rowData = evt.target.value;
      }else{
        rowData = evt.target.parentElement.value;
      }
      
      let source = map.getSource(rowData.source);
      let data = source.serialize().data;
      let feature = data.features[rowData.id];
      let bbox = turf.bbox(feature);
      let mlBbox = [[bbox[0],bbox[1]],[bbox[2],bbox[3]]]
      map.fitBounds(mlBbox, {
        padding: {top: topPadding, bottom:20, left: 20, right: 20},
        linear:true
        });
      } catch (error) {
        console.log(error)
      }
      
    }

    function tableRowOver(evt){
      try {
        let rowData;
        let element;
      if(evt.target.tagName == "TR"){
        element = evt.target;
        rowData = evt.target.value;
      }else{
        element = evt.target.parentElement;
        rowData = evt.target.parentElement.value;
      }
      element.style.backgroundColor = "#ddd";
      element.style.border = "1px solid rgb(255, 255, 255)"
      map.setFeatureState(
          { source: rowData.source, id: rowData.id },
          { hover: true }
      );
      
      } catch (error) {
        console.log(error)
      }
    }

    function tableRowLeave(evt){
      try {
        let rowData;
        let element;
      if(evt.target.tagName == "TR"){
        element = evt.target;
        rowData = evt.target.value;
      }else{
        element = evt.target.parentElement;
        rowData = evt.target.parentElement.value;
      }
      element.style.backgroundColor = "";
      element.style.border = "";
      map.setFeatureState(
          { source: rowData.source, id: rowData.id },
          { hover: false }
      );
      
      } catch (error) {
        console.log(error)
      }
    }

    function toggleTableTab(event, ID){
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("map-table");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("map-table-button");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(ID).style.display = "block";
        event.currentTarget.className += " active";

    }

})();