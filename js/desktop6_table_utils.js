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
        features.forEach(element => {
            let tr = document.createElement('tr');
            
            Object.values(element.properties).forEach(property => {
              let td = document.createElement('td');
              td.innerText = property
              tr.append(td)
            })
            //td.innerHTML = JSON.stringify(element.properties)
            
            table.append(tr)
        });
        return table
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