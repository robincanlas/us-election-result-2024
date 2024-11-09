import { default as OlMap } from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import { Coordinate } from 'ol/coordinate';
import BaseLayer from 'ol/layer/Base';
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { MutableRefObject, useRef, useEffect, useState } from "react";
import { transform } from 'ol/proj';

interface useOlMapProps {
  tileLayerUrl?: string;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
}

const useOlMap = ({
  tileLayerUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  minZoom = 2,
  maxZoom = 18,
  defaultZoom = 2
}: useOlMapProps) => {
  const map: MutableRefObject<OlMap | undefined> = useRef(undefined);  

  const [popup, setPopup] = useState<Overlay | null>(null);
  const tileLayer = useRef(new TileLayer({
    source: new XYZ({
      url: tileLayerUrl
    }),
  }));

  useEffect(() => {
    map.current = new OlMap({
        target: 'map',
        layers: [tileLayer.current],
        view: new View({
          center: [0, 0],
          zoom: defaultZoom,
          minZoom,
          maxZoom
        }),
        controls: []
      });

    return () => {
      map.current?.setTarget();
    };
   }, []);

   const zoomTo = (zoom: number = 2, coordinates: Coordinate) => {
      map.current?.getView().setCenter(transform(coordinates, 'EPSG:4326', 'EPSG:3857'));      
      map.current?.getView().setZoom(zoom);
   };

   const addLayer = (layer: BaseLayer) => {
      map.current?.addLayer(layer);
   };

   const addOverlay = (overlay: Overlay) => {
      setPopup(overlay);
   };

   useEffect(() => {
    if (!popup) return;
    map.current?.addOverlay(popup);
   }, [popup]);
   
  return {
    map,
    popup,
    tileLayer: tileLayer.current,
    addLayer,
    addOverlay,
    zoomTo
  };
};

export default useOlMap;