class MapHeader {
    onAdd(map){
      this.map = map;
      this.container = document.createElement('div');
      this.container.className = 'mapboxgl-ctrl map-header';
      this.container.style.margin = 0;
      this.container.innerHTML = '<div ng-if="\'True\' ==\'True\'" class="ShhunaReSize smallSize ng-scope">\
                                  <div class="ShhunaReSizeBtn "></div>\
                                  <div class="ShhunaReSizeTxt">פתח מפה במסך מלא</div>\
                              </div>\
                              <div ng-if="\'True\' ==\'True\'" class="ShhunaTitle ng-binding ng-scope" ng-bind-html="\'<b>מפת מרחב</b> הצג לפי:\'"><b>מפת מרחב</b> הצג לפי:</div>';
      return this.container;
    }
    onRemove(){
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
  }