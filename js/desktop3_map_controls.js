/**
 * Creates a map header control, used to contain title and buttons.
 * @class
 * @param {Object} params - an object containing keys for `location`, `showLocation` and `title`  
 */
class MapHeader {
  constructor(params) {
      params.location = params.location || '';
      params.showLocation = params.showLocation || 0;
      params.title = params.title || '';
      this.title = params.title;
      this.location = params.location;
      this.showLocation = params.showLocation;
    }
    onAdd(map){
      this.map = map;
      this.container = document.createElement('div');
      this.container.className = 'mapboxgl-ctrl map-header';
      this.container.style.margin = 0;
      let innerHTML = '<div ng-if="\'True\' ==\'True\'" class="ShhunaTitle ng-binding ng-scope" ng-bind-html="\'<b>מפת מרחב</b> הצג לפי:\'"><b>מפת מרחב</b> הצג לפי:</div>'
      

     if(this.title.length > 0){
      innerHTML = `<div class="ShhunaTitle"><b>${this.title}</b></div>`;
     }else{
      if(this.location.length > 0){
        innerHTML = `<div class="ShhunaTitle"><b>מפת מרחב</b>: ${this.location}</div>`;  
       }
     }

     this.container.innerHTML = innerHTML;
     
      
      return this.container;
    }
    onRemove(){
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
  }

/**
 * Creates button to show and hide the map legend.
 * @class
 */
class MapLegendButton {
  constructor(opts){
    this.LegendBuilder = opts.LegendBuilder;
 }
  onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.id = "add-map-legend-button"
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group map-legend-button';
    this.container.innerHTML = '<button><i class="fg-map-legend fg-lg" style="color:#000;"></i></button>';
    this.container.title = "הדלקת מקרא"
    this.container.value = 0;
    this.container.onclick = this.LegendBuilder.addLegend
    return this.container;
  }
  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

class MapChangeBoundsButton {
  onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.id = "change-bounds"
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group map-legend-button';
    this.container.innerHTML = '<button><i class="fg-map-extent fg-lg" style="color:#000;"></i></button>';
    this.container.value = 0;
    //this.container.onclick = LegendBuilder.addLegend
    return this.container;
  }
  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

/**
 * Container control for map legend
 * @class
 */
class MapLegend {
  onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.id = "map-legend"
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group map-legend';
    this.container.innerHTML = '';
    this.container.onclick = function(e){
      e.stopPropagation()
    }
    return this.container;
  }
  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

/**
 * Creates button to show and hide the map table container.
 * @class
 */
class MapTableButton {

  onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.id = "add-map-table-button"
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group map-table-button';
    this.container.innerHTML = '<button><i class="fa-solid fa-table"></i></button>';
    this.container.title = "פתיחת טבלאות"
    this.container.value = 0;
    this.container.onclick = tableBuilder.addTables
    return this.container;
  }

  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }

}

/**
 * Creates an empty control of defined height and width
 * @class
 */
class FillerControl {
  /*
    Meant to take up space so other controls can appear naturally under/over it
  */
 constructor(opts){
    this.height = opts.height || 30;
    this.width = opts.width || 30;
 }
 onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this.container.innerHTML = ''
    this.container.style.height = `${this.height}px`
    this.container.style.width = `${this.width}px`
    return this.container;
 }
 onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
 }
}

/**
 * Creates a tabbed table for the visible features of each layer
 * @class
 * @param {Array} layers - an Array of layer objects
 */
class LayerTable {
  constructor(opts) {
    opts.layers = opts.layers || [];
    this.layers = opts.layers;
  }
  onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.id = "map-table-container"
    this.container.className = 'map-table-container mapboxgl-ctrl mapboxgl-ctrl-group';
    this.container.innerHTML = '';
    this.container.onclick = function(e){
      e.stopPropagation()
    }
    let tablesContent = document.createElement('div');
    tablesContent.className = 'tablesContent';
    this.container.append(tablesContent)
    let tables = []
    if(this.layers.length > 0){
      this.layers.forEach(element => {
        if(element.table && element.table == true){
          let uniqueId = utils.getUniqueName()
          let tabButton = document.createElement('button')
          tabButton.className = 'map-table-button'
          tabButton.innerText = element.name_heb
          tabButton.onclick = function(event){
            tableBuilder.toggleTableTab(event,uniqueId)
          }
          let table = document.createElement('div')
          table.id = uniqueId;
          table.className = 'map-table';
          let tableContent = tableBuilder.buildTable(element)
          esriRenderer.activateHighlightLayer(element)
          table.append(tableContent)
          tables.push(table)
          this.container.append(tabButton)
        }
      });
      
      tables.forEach(element => {
        tablesContent.append(element)
      })
    }
    return this.container;
  }
  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}