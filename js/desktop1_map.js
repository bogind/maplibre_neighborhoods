maplibregl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    null,
    true // Lazy load the plugin
    );

let map = new maplibregl.Map({
    container: 'gis-map', // container id
    style: {
        "version": 8,
        "sprite": "https://gisportal02.tlv.gov.il/arcgis/rest/services/Hosted/TelAvivCacheRekaHeb/VectorTileServer/resources/sprites/sprite",
        "glyphs": "https://gisportal02.tlv.gov.il/arcgis/rest/services/Hosted/TelAvivCacheMapHeb/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
        "sources": {
          "esri": {
            "type": "vector",
            "tiles": ["https://gisportal02.tlv.gov.il/arcgis/rest/services/Hosted/TelAvivCacheMapHeb/VectorTileServer/tile/{z}/{y}/{x}.pbf"]
          },
          'raster-tiles': {
            'type': 'raster',
            'tiles': [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            'tileSize': 256,
            'attribution':'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        "layers": [
            /*{
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles',
                'minzoom': 0,
                'maxzoom': 22
                },*/
          {
            "id": "גבול העיר/1",
            "type": "fill",
            "source": "esri",
            "source-layer": "גבול העיר",
            "layout": {},
            "paint": {
              "fill-color": "#F6F1E7"
            }
          },
          {
            "id": "גבול העיר/0",
            "type": "line",
            "source": "esri",
            "source-layer": "גבול העיר",
            "layout": {
              "line-join": "round"
            },
            "paint": {
              "line-color": "#FF5500",
              "line-dasharray": [
                2.6665,
                2.6665
              ],
              "line-width": 2.00012
            }
          },
          {
            "id": "נחלים",
            "type": "fill",
            "source": "esri",
            "source-layer": "נחלים",
            "layout": {},
            "paint": {
              "fill-color": "#B6DEFF",
              "fill-outline-color": "#9EBBD7"
            }
          },
          {
            "id": "cl_akolt_buff:2",
            "type": "fill",
            "source": "esri",
            "source-layer": "cl_akolt_buff:2",
            "layout": {},
            "paint": {
              "fill-color": "#FFFFFF"
            }
          },
          {
            "id": "cl_akolt_buftoop",
            "type": "fill",
            "source": "esri",
            "source-layer": "cl_akolt_buftoop",
            "layout": {},
            "paint": {
              "fill-color": "#FFEBC4"
            }
          },
          {
            "id": "cl_akolt_buff:1",
            "type": "line",
            "source": "esri",
            "source-layer": "cl_akolt_buff:1",
            "layout": {
              "line-cap": "round",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#CCCCCC",
              "line-width": 0.533333
            }
          },
          {
            "id": "שטחים ירוקים",
            "type": "fill",
            "source": "esri",
            "source-layer": "שטחים ירוקים",
            "layout": {},
            "paint": {
              "fill-color": "#CBE5B1"
            }
          },
          {
            "id": "הצללת מבנים",
            "type": "fill",
            "source": "esri",
            "source-layer": "הצללת מבנים",
            "minzoom": 15.85,
            "layout": {},
            "paint": {
              "fill-color": "#CCCCCC"
            }
          },
          {
            "id": "מבנים",
            "type": "fill",
            "source": "esri",
            "source-layer": "מבנים",
            "minzoom": 15.85,
            "layout": {},
            "paint": {
              "fill-color": "#F5F5F5",
              "fill-outline-color": "#CCCCCC"
            }
          },
          {
            "id": "מנהרות/1",
            "type": "line",
            "source": "esri",
            "source-layer": "מנהרות",
            "minzoom": 14.85,
            "layout": {
              "line-join": "round"
            },
            "paint": {
              "line-color": "#CCCCCC",
              "line-dasharray": [
                0.454545,
                0.30303
              ],
              "line-width": 8.8
            }
          },
          {
            "id": "מנהרות/0",
            "type": "line",
            "source": "esri",
            "source-layer": "מנהרות",
            "minzoom": 14.85,
            "layout": {
              "line-join": "round"
            },
            "paint": {
              "line-color": "#FFFFFF",
              "line-width": 3.46667
            }
          },
          {
            "id": "צירי רחוב 2/1",
            "type": "line",
            "source": "esri",
            "source-layer": "צירי רחוב 2",
            "minzoom": 13.42,
            "maxzoom": 15.42,
            "layout": {
              "line-join": "round"
            },
            "paint": {
              "line-color": "#CCCCCC",
              "line-width": 6.13333
            }
          },
          {
            "id": "צירי רחוב 2/0",
            "type": "line",
            "source": "esri",
            "source-layer": "צירי רחוב 2",
            "minzoom": 13.42,
            "maxzoom": 15.42,
            "layout": {
              "line-join": "round"
            },
            "paint": {
              "line-color": "#FFFFFF",
              "line-width": 3.46667
            }
          },
          {
            "id": "צירי רחוב",
            "type": "line",
            "source": "esri",
            "source-layer": "צירי רחוב",
            "maxzoom": 13.42,
            "layout": {
              "line-join": "round"
            },
            "paint": {
              "line-color": "#FFFFFF",
              "line-width": 0.533333
            }
          },
          {
            "id": "צירי רחובות ראשיים/0",
            "type": "line",
            "source": "esri",
            "source-layer": "צירי רחובות ראשיים",
            "maxzoom": 14.85,
            "layout": {
              "line-cap": "square",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#FFEBC4",
              "line-width": 3.46658
            }
          },
          {
            "id": "מסילת ברזל",
            "type": "line",
            "source": "esri",
            "source-layer": "מסילת ברזל",
            "layout": {
              "line-join": "round"
            },
            "paint": {
              "line-color": "#9C9C9C",
              "line-width": 1.06667
            }
          },
          {
            "id": "מנהרות/label/ברירת מחדל",
            "type": "symbol",
            "source": "esri",
            "source-layer": "מנהרות/label",
            "minzoom": 14.85,
            "layout": {
              "symbol-placement": "line",
              "symbol-spacing": 1000,
              "text-font": [
                "Arial Italic"
              ],
              "text-size": 17.3333,
              "text-field": "{_name}",
              "text-optional": true
            },
            "paint": {
              "text-color": "#000000",
              "text-halo-color": "#FEFEFE",
              "text-halo-width": 1.33333
            }
          },
          {
            "id": "שמות רחובות/label/ברירת מחדל",
            "type": "symbol",
            "source": "esri",
            "source-layer": "שמות רחובות/label",
            "minzoom": 14.37,
            "layout": {
              "symbol-placement": "line",
              "symbol-spacing": 1000,
              "text-font": [
                "Arial Bold"
              ],
              "text-size": 14.6667,
              "text-field": "{_name}",
              "text-optional": true
            },
            "paint": {
              "text-color": "#686868",
              "text-halo-color": "#FEFEFE",
              "text-halo-width": 0.666667
            }
          },
          {
            "id": "שמות רחובות ראשיים/label/ברירת מחדל",
            "type": "symbol",
            "source": "esri",
            "source-layer": "שמות רחובות ראשיים/label",
            "minzoom": 12.42,
            "maxzoom": 14.47,
            "layout": {
              "symbol-placement": "line",
              "symbol-spacing": 1000,
              "text-font": [
                "Arial Bold Italic"
              ],
              "text-size": 14.6667,
              "text-field": "{_name}",
              "text-optional": true
            },
            "paint": {
              "text-color": "#686868",
              "text-halo-color": "#FEFEFE",
              "text-halo-width": 1.33333
            }
          },
          {
            "id": "שמות מקומות",
            "type": "symbol",
            "source": "esri",
            "source-layer": "שמות מקומות",
            "minzoom": 14.85,
            "layout": {
              "icon-image": "שמות מקומות",
              "icon-allow-overlap": true,
              "text-font": [
                "Arial Regular"
              ],
              "text-size": 10.6667,
              "text-anchor": "center",
              "text-field": "{_name}",
              "text-allow-overlap": true,
              "text-optional": true
            },
            "paint": {
              "icon-color": "rgba(236,233,216,0)",
              "text-color": "#732600"
            }
          },
          {
            "id": "כתובות",
            "type": "symbol",
            "source": "esri",
            "source-layer": "כתובות",
            "minzoom": 15.85,
            "layout": {
              "icon-image": "כתובות",
              "icon-allow-overlap": true,
              "text-font": [
                "Arial Regular"
              ],
              "text-size": 12,
              "text-anchor": "center",
              "text-letter-spacing": 0.01,
              "text-field": "{_name}",
              "text-allow-overlap": true,
              "text-optional": true
            },
            "paint": {
              "icon-color": "#FFFFFF",
              "text-color": "#686868"
            }
          }
        ]
      },
    center: [34.789071,32.085432], // starting position
    zoom: 12 // starting zoom
    });

map.addControl(new maplibregl.NavigationControl());
let neighborhood_url;
let neighborhhod_bounds;

/* Layer Urls */
let parks1_url = "http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/842/query?where=1%3D1&outFields=Shape&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson";
let parks2_url = "http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/551/query?where=1%3D1&outFields=Shape&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson";

let libraryUrl1 = 'http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/635/query?where=1%3D1&outFields=Shape,sug&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson'
let libraryUrl2 = 'http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/570/query?where=1%3D1&outFields=Shape&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson'

let mosdotKehilaUrl = 'http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/553/query?where=1%3D1&outFields=Shape,shem&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson'

let mosdotTarbutUrl1 = 'http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/552/query?where=1%3D1&outFields=Shape&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson'
let mosdotTarbutUrl2 = 'http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/572/query?where=1%3D1&outFields=Shape&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson'
let mosdotTarbutUrl3 = 'http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/573/query?where=1%3D1&outFields=Shape&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson'
let mosdotTarbutUrl4 = 'http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/574/query?where=1%3D1&outFields=Shape&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson'
let mosdotTarbutUrl5 = 'http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/569/query?where=1%3D1&outFields=Shape&returnGeometry=true&geometryPrecision=6&outSR=4326&f=geojson'

/* Icons */
let libraryIcon1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAYCAYAAAARfGZ1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAABCFJREFUSIm11X1oE3ccx/H33SUm6YOpqX1IY3xoTaumdlBt2toWHPOBVqEOx6ZuE4azjsEm1UJ1groH6TY3K90U2fbHGChzTFC7dQoKyrSGMbdurton06S2TQ1LTam2PZvL7Q9tl2jQ7I994OCO34/XfflwP07D/xhN+MM2iFfNWDVTdFZVK1uRSEIhgEQARXcHXXxAkAfvMIPA/gsMAepT8ZocakNjjIpwHz23BRgIKlwQFFQJ9qkK60EGWX6g9ULNXELAEBBgnDshLW3BBLY3tDAQgSsa07l6z+BVVVXLgGQg7eHFcCBw+v2i9HWqIguPDCYC04BpaJkjQr45uzKFllMrInAJQg831wEl4UKC0YjOPJ+x3pYYStYUPFZLKDiYCfwebf/ArZ7YYGDWIkc/x05E4tIYadvm8vXx+k/mmTIsTLdYMKWlI4+McOrg/pjgRPtyLLYc307Q1sH4JL7fw2HgsFpdc+mW62aJPDKC+8Z1fD1u5pUtpXDtS+gNcQy4u+lr+4uU2ZlMSzdjnJ6C0ZRMQlISicYk+rpd/vEcttPOh5N4eLRTpmDNzGJu7sKoE/494GV6ujnqWnbeM70ouiSQ/61lIoM+n6G3q5O0DAuCKMZUx6MRJHnqxH0Ero8zBEfuDnOktpqC1WvIdRSiN8TFDCuKIiphB2sS3zqLrOamJovX1UH/b5c5frKBk2Y7pVtqyX/2OVIzMqKCaiiE3+ejv9uFs/FEpYRu/WO1SFqOpFqtI60XzzHWcxUA2dvK+b0bOb8XFry8iyVr1hJvNNLvcdN3swvXtT+4cfYU9zp/nmBmChIOoHkS/wKkDvDkFS8xLFhcYLvUVEFT7XpURZ6c8PrRfVw/ui/q9Kb8ShwvbkAfF3++tGJ1Q0QtVaDUQAKARqtlaeXzzFvUyYkDH+FuPBQVnGpfSeG6jcx3FGKZPQdRFOl1uQZ4cNojawGd+0/nlfy8omIA0mdYeePjgziXlXN612ZCd73E28pwbNiE3VGMNSsLUZIiXqgoQbEONDshGIHf75J3tzmbXx/y+yktr0AQRSSNhpKKVVhtF5HHRsmcvwBJ89jRAGB4aAjnj415/hy20s6nEXgD3K9/u7qt+cxPJd99Vs+aLW+i0xsA0Op0zLTZoqKDvts4z57B29lO/spy97pqDkSpBURRpLRiFa2/pvLljho2vLMHU2oq0f4J3h4PlxtP4u/1sPzVTZS/shGgi2jfeXjsiwswmpL5quYtXtixG0NCIgCqquLpaOfi999yb9DPiteqyLLnIgjC5Hp4InBBEErDn6vN5oWHruT+II3zi6rHiaLbDLIEvJfdxTHbgc+VqF09afKJ1Hu913baKQpCIwr5IH+Q3cU3VfBENCYcoK4V7x4o08P4xCcWa56KA7wLo/8Fncg/50JzgPiI/YEAAAAASUVORK5CYII='
let libraryIcon2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAb9JREFUOI2t1LGK4lAUBuD/XkOWYDBN0CqFlorYuCDBzhQRBMFyy3kDn0SQeYUpbPQJbEQRQS2CYCG4RYQopBANJDuQOMUwzsREM9ndU13+e/hyknsJg/9czMdis9m8nM/nn5fLhcRFKKUuy7LPhULh+Qrquv5rPB7/9WSKojwB+AQ9z/M1iKKIer0OjuMwn8+xXC4fgp7nJYAvr3xbjUYDkiQBAFRVxXa7xfF4jJz0LphKpa7rRCIBQRD+DdQ0DdVqFYQQ7HY76LoeiT0EXdeFbduYzWaYTqeBb0wpDWR3wVqtBlmWAQCmacJ13etepVKBIAiwLAuTyeR7YD6fD526VCpBURQQQmBZFhaLBRzHiQY5jgtkkiRBVVUQ8n7veZ5Hs9lEr9eLBm+L53m0Wi2wLOvLTdMM9H4LZBgGlmX5rtJ6vcZwOIwPZrNZJJNJaJoGhmGQTqdhGAYGg0H4w6PAcrkcyA6Hg+/kY4Ffy7ZtrFYrjEajuz2hYL/fB6U0kJ9OJ+z3+1Do4/SvYCaT+S3LcvbRhKIoIpfLhe7xPD/3gcViMdfpdH44jhP7B2sYhtftdl99IAC02+0/cbHbegN+tZl2GPzIFQAAAABJRU5ErkJggg=='
let libraryIcon3 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAXdJREFUOI2t0bFPU1EUx/HvKQ0nYWyCpBM6sBhdXV3cTJgciAPEscXQNA4kzv4FrHRjc3TSURJcmGCTQEw6+BJjmk7EH9Aeh9LSlve8pPib7rv5vc89970y/znl4SLcnyM9AWwGp0el8s06naMbUNoweDPzaJ3OO+AGBOanKj+BJu4Z0jbwMkHOw9iVc1Iz+IREwCHQBhZTgxaD1eoZWQaAwZ+AX/cCI8s2A94a9GNw3ccp7N8TggPVPnwA1rn99yNnLx8M952S1Lh+awUojSkfcW8jPbDBQWnQKpXW8PtN5YvBa5N6AY+AV8BCEiTL0dy/I60Z9AAMfgQ0gN00eDtdpFWD7vhmuD81aaJ4V/AS92WkkxEGdaSt6WISDPd9k34j1cL93KSDcH+BtJPXT4Il6f3oYXg96RkwNxM4MS0shXsTqV7UKU/2R/kccJXTXzLpYfF5Y6DB1xgtC3MKHOTs9w2Op8FWwF4CLErf4GICvEaV3797/gKJVoFQ4PzC2AAAAABJRU5ErkJggg=='
let libraryIcon4 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAbpJREFUOI2t1EFIFFEcx/Hvm33sgygIo8RTdoggDATBgSC62Enw1CE8GF0W1N2VpUPYWfAoONupvXXz6MnoUobBEkJ1iaIIPDQQIp7Ev86b10VHd3bW2bX+l3nz3o/P+8MMf81/Ln28MCPBfcENYTzVsyLYPht/2PlU/ZyAonkM6gnWnautHc1T4AQkUkV0C/abiJrRcSh4z4Dxs1VVPLI7BqbZLK8KAIsf8S9uAVe7aDa7BiL3M0ze5vch+PNPYGiYhTdleBBztz6OdbfzsDNBrDPc+jrA5WAB66aA9Nd3GXvZoIlYls3qHAB+cBPwksMCK8ayJahr4Ka6Avus1wizDiL1mmZxUihZ7gU32OMhmgu5YGjiNs/AN7nkPYKSBeB95Rd+MAe8zAUzalewE7yt7LZcEnFHUkK34KEp6usC35OdkWBGNNV0MBc0uHVBbcsB08av70mzvGGGX4yJjpez8rmgNKvPk/Xx08SjQOFcYEsN1/uNcTWBmU6RE1C7U5NBreEHUXvc9QsMdrBcusN3AETq6O/PHIs/gI32tlxMgS+tYLPSgKVXsN/7gOVKDKWDdIdATbLivdRfVDyODE9oZBgAAAAASUVORK5CYII='

let mosdotKehilaIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAY9JREFUSInd1b1qwmAUxvF/pMWxsw4hiwa6dHIqFBddXOrkdQRcjJvDq0PAu3DzBrwFA65+LCWCWc2Y6XRKiEaNH8RCnymEc95fzpuvF56Ul6dDxWJRhWH4lYPRAoIYCsPwHfjMAXqFxESz2cwwDCOzq1qtArBerzNrF4sFnU6HA0jX9bdKpXKxUdO0A1BELtYHQRAfX/0wJJHkuSzsZujRXISiKUQEEUlNFU2TrLsZSi4abZGIUC6XAdjtdmfrMqF+v49SChHBNE1Wq9XBotvtFt/3AfB9n1KphOd56LoOgGmaMWjbNu12+zSklDp7ZcfbFk0WTXpcp5Q6D2UtfirJmmPUdd3TUNQ0HA7p9XpxcxYY1Wiaxng8xrIsAObzeRqaTCYA2LYdI/fEsiy63S6O4zCdTtPQYDAAoNFoxPfq3rRaLRzHYTQapaG884+h5XIZv3CPpl6vIyK4rkutVjuEkrn2i3xLTwx5nhcUCoWbAYDNZnPy/H6/T0PNZvMH+LgHiv66l/InT933s6Bc8wvT66OVbn7ltgAAAABJRU5ErkJggg=='

// mahol
let mosdotTarbutIcon1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAYAAABNChwpAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAuNJREFUSIntlktoE1EUhv9z78QmJtM0pA/S0FJKRbAgClJduRKFrkRQWlAsgl3oQtAuXLkVXVfRnSBaoQt3FUT3deVjoZQWtc+UxrQmsTVOZua6GBx6Z+7kgYZ24b/8557zf2fumRANOyxtVwEIIVIA4g3OzBFRNgjgNhFdrKebaQpoGtV8XghxB8BNJUCtKvywsLBiwLaBUIhQLgswArrTe9Ac43X1qhmgULSwmDFgC6BF5+jfFwFtG1wIYHnVwMKyASKgq7M2mIoA+aKFDzMl5DYsJFs4etIh99lSxlDWxHUn9P2nEta/W0gmOA7uD6NZV8MEAggBQACFgo3mGEPZFJidV4cGSY8x5As2hHD6kWJVAgGInAbtrRwH+sJ1BW/Xx7kS9BhThlcEcCAIuQ0L0++2cOJ+0fXvDUbQlmA492TT9SbPR7G2buPq1E/Xe3VFR7ksQEHp1QGAzg4Ne8NM8tNtDO1JuTTdoUHjpuT1pEPY3LIDp68K8AeCy/nQOEHjXg8IcTmJMUBU6V/TZ8iY3FjTCNwTxhmBe6C8dVUBVrOWHm6SiwwDYLpcxJkzneRxB8J7zigLbOQt1ytuWgkMZfrwLDXnA+i8nj3jJXw6FEWqTX5RjMM3LWeOL51jhNl5EwN389vtUXCMAiAfgEqqxpyTf1quuBYO3654VRVAU7xajfkbq8JUe1E3AOekuO+gJZQ9Yg7sXwFozL/NnCuWUBHGGUHjlb+EQIALvRyDR8OIRAhflwxMDEfdZ78MgWzOkry1nAXDFJL3ZdFAJEKYGI5i6k0Jjz9b8EoJcLaL49alOPp6mlzvcH/Ed27gUMXhJB3pb0LpYR6TizKEDyAVIoyPJdCa0GDb1X7Haldv9x6MjyXw+kZOrJvCvRcfQKYs0HHt2z8LVkhait31r/g/wIvLselkCz/WyMCVNfPl6Udbz5UAp47HZoiooQBCiLc4GX+gBGCMjQAYaSSAVzu+A78BC/vKvWu20ukAAAAASUVORK5CYII='
// museoms
let mosdotTarbutIcon2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAbCAYAAAAdx42aAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAqZJREFUSIntlktrFEEUhb+umprKQwRHRMXHuIjOT/CNy4AgLgT/gYhbScRsFN0o6sadGx97cSGCoHtBQUHwAcERmSQoKk4UFLv6dlW7MCTdPWMm0Wg2nuXp03W/unWL7grLrMqfLnAa+s/A938KMNZgs8DOyFP5pvk+6un3Gu/hweVxJv8KwIkh6kGzPYAW7OSlcXcTCLmIGm3YnccbbreCYODhuXEm/ghgdIgtmeYQUE9hAm8fKU0GMNKwu8r5DFDYqeCJnHaHRxp2E7iW8ty60KS1WADlIdKxXZcZ90FBH7h9+F57AgX8zLmPkdj1qXFqxg7l7HwAYU2TyU9110xWcLt32e6qTruDa5pMdiveC4Ax8CPGbql+dUeAs7MPNHfwvAWO5uJX0GzAcyDnncLYgTHcL/vWawizCPccYTozedu+CeJeq7wnvEQj+ZQXHmvjVvNzPH4LADQZYgXcrBXFJAqSUjIhtglmLmeMlYCL5lt+QdcwM6QFwyABRJU8KHYgo/ReL4CTdYbKgcQzoDSSn/6MzmJ08zRCzEC3dc+3aHYApIZX5aCC64HBZyp3BOCEElTQiPKu1IFBwbgdKVwprwtEHQC/kFApFpsZts4OlKCoIMGXjqqkhQyhZG0rDBbchJiE/C2ISegrDmZoW2FlCWqxABE2tbxLC9MUI1lHB6wQO8lDZbxLNTalcHyLBCBGqHa2e+aKzTkGQYq5UEV0TAFqMQBTwL3MuC8e9gBXZ5/0MZjGbqsyOU/cNvrox895VcPeDPd55t1hYONCAd5HwtGLLe7mvBvzwPbUaJ39meEasLYXgFft2vCqdvvFuSX4Y5pVi/vTtdpwqLWfAHo+AB1q7aefaktWOqd2h7N0O/xN/QcoAgjHlhXgUqvrR+PfASyHfgAr6QuovEVvbAAAAABJRU5ErkJggg=='
// theater
let mosdotTarbutIcon3 = 'data:image/png;base64,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'
// cinema
let mosdotTarbutIcon4 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAxdJREFUSIm91U9oHGUYx/HvzLvDW7Ih0bSCWwir8sKipYdgJAdLq1jwWouHgnpoxVI8qJhJ6Jr6D9RIdg022FaERnoRxIOUgnipFnsKpRQEoSsjZlLs0qazDbXb7rPvzo6HbNOmancji8/lPcyP9/O+Lw/PpPgfK9WtjcYMDzlKZxo1qUyH/AokXcf8HM8R648SJJfE4rge1jcsOpYPCyGHu4aNGSbimB0pxZ5LJc49YLjRtGxWns4kHkd8I8PFgD3/ivlZ/azjyfOJIkPMhSb6m+lAfrg7N2709qaVnYRsnUKqAD5EykMKgZw6MMIWiZjzs+wrhny+CpuE1KLhGMiGxHIC2OXAqItMvGl4uRGwewbqt/JNJN/0OJ/aRD+/UM2PsMFG9MSKYWC+tpB5kHQ5wmMC7sIioz9wlVwtlngBwDeMDgTMXoMvreEzbfR7k4G8A/AbKGCLC2eawhnfcN5GehAlJ92YWT9LHq9smoofXcjtz2I+DglSAG9D303kDWAiDz2SY4CYbGSwtw6TIESGPMB9t19zuLU+DeJ4JZ6wWY4Cj7j9mOJZFn3DT3HvwP1QWb6ZGD0EcpUaT1qjX3FjGQScDnpEt9YyULeGBaDPUYxPnWWx9S2TNCoXV56xAcqF+WLIztdzMujFLHQA3VkZ4JS1PKM8XnRj9h0YYba6kNnoqPKNQok/VjC9Xn62Szyah57aNdKkuQms6/B2AHUHdh8MmQfe9w1ba0ucVOlyndry069gk3Nc8Q3fSo6CinncsfiJxwzLjdBJXW+AC62uthx34VMUo4WA71ZhANWA19KG74GhuHfgVVcqHToA9Ck45xt0BA0XTjfR26ZLcvrO0Ap2BP7MBzzVyLLXpfLJGm4FcAn0S46Vxy6HHD0GNZC/hVZNkEmwhBwCDvmGxhrAfpAvEg+zcYSvmaP2T6FuTf1ewLQLde0X00l1B7MsAb/jMfSfMEfxVhwz7sL6NtS7DlzhYb6SJdYV54jWjBVKTI0Z9iZtsHrA9AxcJ2xzpHthAIlimxPj3SszA9X2TAdYsTXTulV/AeG+JaTPxU4ZAAAAAElFTkSuQmCC'
// music centers
let mosdotTarbutIcon5 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAWCAYAAAAinad/AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAbtJREFUOI2t07FrFEEUx/HvzswyCRtEDoucYIIQWCHYaGGuSCmJaBX/gVSxUeIdR8DC1gORBa01/4FG7CVl0MJCOHWJgSSQbCG3ouQk493s2ph4xsvtrvor33vzmQfDKP5j1L8croEnx5m3I6W1oBm/+Sts0eeMu69vgllIXU6y175SeLOaX5oSNr6N5Tqu+eNsJtYA1fKZw1LFxlODZgdidZ/aJ8uisIwdM/IVGM63meWeAN2ns4nkUTvksTfBej7sSBJYQxKcC1lZAAtQ7+nnwbrAs0SWgiCMXw0azMQS9Gzw0byEOPPWTExp7wuYTCgXdiROdUJPK5hJMaOgd5FmiE5B7M4lTpkWLwSmkh5WDVgQkBbCOi19S2AqfVpdd8i8L4Ql0rwVlhRwesqfHcmNRsh2ISwIeVovl887J6KrqdUjjjQfVMjzBnw7mDnE6uXyJF5UTeCygFFgB3B7wQdR1CSiedzrKoAlX1cSG60CWvzqnQXoxno/7/YKILVco/8ffB1E0btC2PeOWXZhFpcLP+ttpH4yHJq7QFIIe7jFBnBxaZLT6R6e2mKzgenkRX7DDnK/yW5RoDc/AGp6jVHjUhVhAAAAAElFTkSuQmCC'

/* get query string */
var search = location.search.substring(1);
if(search.length > 1){
        var QS = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        if("ne" in QS){
            var neighborhood_code = parseInt(QS.ne)
            neighborhood_url = `http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/511/query?where=oid_shchuna=${neighborhood_code}&outFields=*&returnGeometry=true&outSR=4326&f=geojson`
        }else if("shemShchuna" in QS){
          var neighborhood_name = QS.shemShchuna
          neighborhood_url = `http://dgt-ags02/arcgis/rest/services/WM/IView2WM/MapServer/511/query?text=${neighborhood_name}&outFields=*&returnGeometry=true&outSR=4326&f=geojson`
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
                    
                    map.fitBounds(turf.bbox(neighborhhod_bounds), {
                        padding: 20, linear:true
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
                  // mouse event for hover on the polygon layer
                  map.on('mousemove', 'neighborhoods', () => {
                    map.getCanvas().style.cursor = 'pointer';
                  })
                  map.on('mouseleave', 'neighborhoods', () => {
                    map.getCanvas().style.cursor = '';
                  })
                  // map event for popup
                  map.on('click', 'neighborhoods', function (e) {
                    console.log(e)
                    //var coordinates = e.features[0].geometry.coordinates.slice();
                    var coordinates = e.lngLat
                    var name = e.features[0].properties.shem_shchuna ? e.features[0].properties.shem_shchuna : e.features[0].properties.shem_merhav
                    var description = `<h3>${name}</h3>`;
                     
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                     
                    new maplibregl.Popup()
                      .setLngLat(coordinates)
                      .setHTML(description)
                      .addTo(map);
                    });
                    
                }).then(function(){
                  
                  parks1_url = parks1_url+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  parks2_url = parks2_url+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  libraryUrl1 = libraryUrl1+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  libraryUrl2 = libraryUrl2+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  mosdotKehilaUrl = mosdotKehilaUrl+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  mosdotTarbutUrl1 = mosdotTarbutUrl1+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  mosdotTarbutUrl2 = mosdotTarbutUrl2+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  mosdotTarbutUrl3 = mosdotTarbutUrl3+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  mosdotTarbutUrl4 = mosdotTarbutUrl4+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  mosdotTarbutUrl5 = mosdotTarbutUrl5+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry=${turf.bbox(turf.buffer(neighborhhod_bounds,100,{units: 'meters'}))}`
                  //parks2_url = parks2_url+`&inSR=4326&geometryType=esriGeometryEnvelope&geometry={xmin:${xmin}, ymin: ${ymin} xmax: ${xmax}, ymax:${ymax}}`
                  
                
                });
                
                
                
            });
        
        

    }
    

function addParks(_callback){
  if(map.getSource('parks-source') === undefined){
    map.addSource('parks-source', {
      type: 'geojson',
      data: parks1_url
      });
      if(map.getLayer('parks') === undefined){
        map.addLayer({
          'id': 'parks',
          'type': 'fill',
          'source': 'parks-source',
          'layout': {
            'visibility': 'none'
          },
          'paint': {
          'fill-color': 'rgb(199, 215, 158)',
          'fill-opacity': 0.8
          }
          },'neighborhoods-stroke');
      }else{
        return
      }
  }else{
    return
    
  }
  if(map.getSource('parks2-source') === undefined){
    map.addSource('parks2-source', {
      type: 'geojson',
      data: parks2_url
      });
      if(map.getLayer('parks2') === undefined){
        map.addLayer({
          'id': 'parks2',
          'type': 'line',
          'source': 'parks2-source',
          'layout': {
            'visibility': 'none'
          },
          'paint': {
          'line-color': 'rgb(112, 158, 0)',
          'line-opacity': 1,
          'line-width':2
          }
          },'parks');
      }else{
        return
      }
  }else{
    return
    
  }
  _callback();
}

function addLibraries(_callback){
  map.loadImage(libraryIcon1, function(error, image) {
    if (error) throw error;
    
    map.addImage('libraryIcon1', image);
    if(map.getSource('library-source1') === undefined){
      map.addSource('library-source1', {
        type: 'geojson',
        data: libraryUrl2
        });
        if(map.getLayer('libraries') === undefined){
          map.addLayer({
            'id': 'libraries',
            'type': 'symbol',
            'source': 'library-source1',
            'layout': {
              'icon-image':'libraryIcon1',
              'visibility': 'visible'

            },
            'paint': {
            
            }
            });
        }else{
          return
        }
    }else{
      return
      
    }

    });

  map.loadImage(libraryIcon2, function(error, image) {
    if (error) throw error;
    
    map.addImage('libraryIcon2', image);
    map.loadImage(libraryIcon3, function(error, image) {
      if (error) throw error;
      
      map.addImage('libraryIcon3', image);
      map.loadImage(libraryIcon4, function(error, image) {
        if (error) throw error;
        
        map.addImage('libraryIcon4', image);
        if(map.getSource('library-source2') === undefined){
          map.addSource('library-source2', {
            type: 'geojson',
            data: libraryUrl1
            });
            if(map.getLayer('libraries2') === undefined){
              map.addLayer({
                'id': 'libraries2',
                'type': 'symbol',
                'source': 'library-source2',
                'layout': {
                  'icon-image':["match",
                              ["get","sug"],
                              ["נייד"],
                              "libraryIcon3",
                              ["נייח"],
                              "libraryIcon4",
                              "libraryIcon2"
                              ],
                  'visibility': 'visible'
                },
                'paint': {
                
                }
                });
            }else{
              return
            }
        }else{
          return
          
        }

      })
    })
  })
   
  _callback();
}

function addMosdotKehila(_callback){
  map.loadImage(mosdotKehilaIcon, function(error, image) {
    if (error) throw error;
    
    map.addImage('mosdotKehilaIcon', image);
    if(map.getSource('mosdotKehila-source') === undefined){
      map.addSource('mosdotKehila-source', {
        type: 'geojson',
        data: mosdotKehilaUrl
        });
        if(map.getLayer('mosdotKehila') === undefined){
          map.addLayer({
            'id': 'mosdotKehila',
            'type': 'symbol',
            'source': 'mosdotKehila-source',
            'layout': {
              'icon-image':'mosdotKehilaIcon',
              'text-field': ['get', 'shem'],
              'text-anchor': "bottom-left",
              //'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
              'text-radial-offset': 1,
              'text-justify': 'auto',
              "text-size":10,
              "text-font": ["Arial Regular"],
              'visibility': 'visible'
              
            },
            "paint": {
              "text-color": "rgb(0,0,0)",
              "text-halo-color": "rgb(250,245,217)",
              "text-halo-width": 1.33333
            }
            });
        }else{
          return
        }
    }else{
      return
      
    }

    });
    _callback()
}


function addMosdotTarbut(_callback){
  //
  map.loadImage(mosdotTarbutIcon1, function(error, image) {
    if (error) throw error;
    
    map.addImage('mosdotTarbutIcon1', image);
    if(map.getSource('mosdotTarbut-source1') === undefined){
      map.addSource('mosdotTarbut-source1', {
        type: 'geojson',
        data: mosdotTarbutUrl1
        });
        if(map.getLayer('mosdotKehila') === undefined){
          map.addLayer({
            'id': 'mosdotKehila',
            'type': 'symbol',
            'source': 'mosdotTarbut-source1',
            'layout': {
              'icon-image':'mosdotTarbutIcon1',
              'visibility': 'visible'  
            },
            "paint": {
            }
            });
        }else{
          return
        }
    }else{
      return
    }
    });

//
map.loadImage(mosdotTarbutIcon2, function(error, image) {
  if (error) throw error;
  
  map.addImage('mosdotTarbutIcon2', image);
  if(map.getSource('mosdotTarbut-source2') === undefined){
    map.addSource('mosdotTarbut-source2', {
      type: 'geojson',
      data: mosdotTarbutUrl2
      });
      if(map.getLayer('mosdotTarbut2') === undefined){
        map.addLayer({
          'id': 'mosdotTarbut2',
          'type': 'symbol',
          'source': 'mosdotTarbut-source2',
          'layout': {
            'icon-image':'mosdotTarbutIcon2',
            'visibility': 'visible'  
          },
          "paint": {
          }
          });
      }else{
        return
      }
  }else{
    return
  }
  });


//
map.loadImage(mosdotTarbutIcon3, function(error, image) {
  if (error) throw error;
  
  map.addImage('mosdotTarbutIcon3', image);
  if(map.getSource('mosdotTarbut-source3') === undefined){
    map.addSource('mosdotTarbut-source3', {
      type: 'geojson',
      data: mosdotTarbutUrl3
      });
      if(map.getLayer('mosdotTarbut3') === undefined){
        map.addLayer({
          'id': 'mosdotTarbut3',
          'type': 'symbol',
          'source': 'mosdotTarbut-source3',
          'layout': {
            'icon-image':'mosdotTarbutIcon3',
            'visibility': 'visible'  
          },
          "paint": {
          }
          });
      }else{
        return
      }
  }else{
    return
  }
  });


//
map.loadImage(mosdotTarbutIcon4, function(error, image) {
  if (error) throw error;
  
  map.addImage('mosdotTarbutIcon4', image);
  if(map.getSource('mosdotTarbut-source4') === undefined){
    map.addSource('mosdotTarbut-source4', {
      type: 'geojson',
      data: mosdotTarbutUrl4
      });
      if(map.getLayer('mosdotTarbut4') === undefined){
        map.addLayer({
          'id': 'mosdotTarbut4',
          'type': 'symbol',
          'source': 'mosdotTarbut-source4',
          'layout': {
            'icon-image':'mosdotTarbutIcon4',
            'visibility': 'visible'  
          },
          "paint": {
          }
          });
      }else{
        return
      }
  }else{
    return
  }
  });

//
map.loadImage(mosdotTarbutIcon5, function(error, image) {
  if (error) throw error;
  
  map.addImage('mosdotTarbutIcon5', image);
  if(map.getSource('mosdotTarbut-source5') === undefined){
    map.addSource('mosdotTarbut-source5', {
      type: 'geojson',
      data: mosdotTarbutUrl5
      });
      if(map.getLayer('mosdotTarbut5') === undefined){
        map.addLayer({
          'id': 'mosdotTarbut5',
          'type': 'symbol',
          'source': 'mosdotTarbut-source5',
          'layout': {
            'icon-image':'mosdotTarbutIcon5',
            'visibility': 'visible'  
          },
          "paint": {
          }
          });
      }else{
        return
      }
  }else{
    return
  }
  });

  _callback()

}

function addButtons(){
  var mapHeader = document.getElementsByClassName('gis-header')[0];
  var buttonSpan = document.createElement('span');
  buttonSpan.classList.add('buttons-span')

  //############################################## 
  //  Parks
  //##############################################

  var parksSpan = document.createElement('span');
  var parksButton = document.createElement('input');
  var parksSVGIcon = document.createElement('img');
  var parksText = document.createElement('span');

  parksSpan.classList.add('button-span')
  parksButton.type = "checkbox"
  parksButton.onchange = function(){
    addParks(() =>{
      if(this.checked){
        map.setLayoutProperty('parks','visibility','visible')
        map.setLayoutProperty('parks2','visibility','visible')
      }else{
        map.setLayoutProperty('parks','visibility','none')
        map.setLayoutProperty('parks2','visibility','none')
      }
    })
  }
  parksSVGIcon.src = 'icons/garden icon.svg'
  parksSVGIcon.classList.add('icon')
  parksText.innerText = 'גנים\nופארקים'
  parksText.classList.add('button-text')
  parksSpan.append(parksButton,parksSVGIcon,parksText)

  //############################################## 
  //  Libraries
  //##############################################
  var librarySpan = document.createElement('span');
  var libraryButton = document.createElement('input');
  var librarySVGIcon = document.createElement('img');
  var libraryText = document.createElement('span');

  librarySpan.classList.add('button-span')
  libraryButton.type = "checkbox"
  libraryButton.onchange = function(){
    addLibraries(()=>{
      if(this.checked){
        map.setLayoutProperty('libraries','visibility','visible')
      }else{
        map.setLayoutProperty('libraries','visibility','none')
      }
    })
    
      
    
  }
  librarySVGIcon.src = 'icons/library icon.svg'
  librarySVGIcon.classList.add('icon')
  libraryText.innerText = 'ספריות'
  libraryText.classList.add('button-text')
  librarySpan.append(libraryButton,librarySVGIcon,libraryText)

  //############################################## 
  //  Mosdot Kehila
  //##############################################
  var mosdotKehilaSpan = document.createElement('span');
  var mosdotKehilaButton = document.createElement('input');
  var mosdotKehilaSVGIcon = document.createElement('img');
  var mosdotKehilaText = document.createElement('span');

  mosdotKehilaSpan.classList.add('button-span')
  mosdotKehilaButton.type = "checkbox"
  mosdotKehilaButton.onchange = function(){
    addMosdotKehila(()=>{
      if(this.checked){
        map.setLayoutProperty('mosdotKehila','visibility','visible')
      }else{
        map.setLayoutProperty('mosdotKehila','visibility','none')
      }
    })
    
  }
  mosdotKehilaSVGIcon.src = 'icons/community_icon.svg'
  mosdotKehilaSVGIcon.classList.add('icon')
  mosdotKehilaText.innerText = 'מוסדות\nקהילה'
  mosdotKehilaText.classList.add('button-text')
  mosdotKehilaSpan.append(mosdotKehilaButton,mosdotKehilaSVGIcon,mosdotKehilaText)


  //############################################## 
  //  Mosdot Tarbut
  //##############################################
  var mosdotTarbutSpan = document.createElement('span');
  var mosdotTarbutButton = document.createElement('input');
  var mosdotTarbutSVGIcon = document.createElement('img');
  var mosdotTarbutText = document.createElement('span');

  mosdotTarbutSpan.classList.add('button-span')
  mosdotTarbutButton.type = "checkbox"
  mosdotTarbutButton.onchange = function(){
    addMosdotTarbut(()=>{
      if(this.checked){
        map.setLayoutProperty('mosdotTarbut1','visibility','visible')
        map.setLayoutProperty('mosdotTarbut2','visibility','visible')
        map.setLayoutProperty('mosdotTarbut3','visibility','visible')
        map.setLayoutProperty('mosdotTarbut4','visibility','visible')
        map.setLayoutProperty('mosdotTarbut5','visibility','visible')
      }else{
        map.setLayoutProperty('mosdotTarbut1','visibility','none')
        map.setLayoutProperty('mosdotTarbut2','visibility','none')
        map.setLayoutProperty('mosdotTarbut3','visibility','none')
        map.setLayoutProperty('mosdotTarbut4','visibility','none')
        map.setLayoutProperty('mosdotTarbut5','visibility','none')
      }
    })
    
  }
  mosdotTarbutSVGIcon.src = 'icons/Cultural_institutions_icon.svg'
  mosdotTarbutSVGIcon.classList.add('icon')
  mosdotTarbutText.innerText = 'מוסדות\nתרבות'
  mosdotTarbutText.classList.add('button-text')
  mosdotTarbutSpan.append(mosdotTarbutButton,mosdotTarbutSVGIcon,mosdotTarbutText)

  buttonSpan.append(parksSpan,librarySpan,mosdotKehilaSpan,mosdotTarbutSpan)
  mapHeader.append(buttonSpan)

}
addButtons()