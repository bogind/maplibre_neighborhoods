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
        features.forEach(element => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = JSON.stringify(element.properties)
            tr.append(td)
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