// https://api-election.cbsnews.com/api/public/races2/2024/G?filter.office=P
// https://eric.clst.org/tech/usgeojson/

import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import useOlMap from "../hooks/useOlMap";
import usGeojsonData from './gz_2010_us_040_00_20m.json';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import useMapPointerMove, { MapPointerMoveEventHandler } from "../hooks/useMapPointerMove";
import { getStateResult, handleMouseMove, styleFunction } from "./utilities";
import { default as OlMap } from 'ol/Map';
import Overlay, { Positioning } from 'ol/Overlay';
import { Pixel } from "ol/pixel";
import "./us-president-election-result.css";
import { ElectionResult } from "../types/result";

interface ElectionResultPopupProps {
  map: MutableRefObject<OlMap | undefined>;
  popup: Overlay | null;
  addOverlay: (overlay: Overlay) => void; 
}

const popupWidth: number = 350; 
const popupHeight: number = 200; 

const setPopupOverlayPositioning = (pixel: Pixel) => {
  let position: Positioning = 'top-left';
  if ((window.innerHeight - pixel[1]) < popupHeight && (window.innerWidth - pixel[0]) < popupWidth) {
    position = 'bottom-right';
  } else if ((window.innerHeight - pixel[1]) < popupHeight) {
    position = 'bottom-left';
  } else if ((window.innerWidth - pixel[0]) < popupWidth) {
    position = 'top-right';
  }

  return position;
};

const ElectionResultPopup = ({
  map,
  popup,
  addOverlay
}: ElectionResultPopupProps) => {
  const popupRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [stateResult, setStateResult] = useState<ElectionResult | null>(null);

  useEffect(() => {
    addOverlay(new Overlay({
      element: popupRef.current as HTMLDivElement,
      stopEvent: false,
      positioning: 'top-right',
    }));
  }, []);

  const handlePopup = useCallback((event: MapPointerMoveEventHandler, map: OlMap) => {
    if (!map) return;
    const pixel = map.getEventPixel(event.originalEvent);
    if (!pixel) return;
    const target = map.getTargetElement() as HTMLElement;
    if (!target || !popup) return;

    const hit = map.hasFeatureAtPixel(pixel);
    if (hit) {
      const features = map.getFeaturesAtPixel(pixel);
      if (features.length > 0) {
        const result = getStateResult(features[0]);
        if (result) {
          setStateResult(result);
          popup.setPositioning(setPopupOverlayPositioning(pixel));
          popup.setPosition(event.coordinate);
        }
      }
    } else {
      popup.setPosition(undefined);
    }
  }, [popup]);

  useMapPointerMove({ map, handler: handlePopup });

  return (
    <div ref={popupRef} id="popup" className="ol-popup-presidential-result">
      {stateResult?.stateName}
    </div>
  );
};

const UsPresidentElectionResult = () => {
  const { map, popup, zoomTo, addLayer, addOverlay } = useOlMap({});

  useEffect(() => {
    zoomTo(4, [-95.712891, 37.09024]);
    
    const vectorSource = new VectorSource({
      features: new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeatures(usGeojsonData),
    });
    
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        return styleFunction(feature, map.current!);
      },
    }); 

    addLayer(vectorLayer);

  }, [map, addLayer, zoomTo]);

  useMapPointerMove({ map, handler: handleMouseMove });

  return (
    <div>
      <ElectionResultPopup map={map} popup={popup} addOverlay={addOverlay} />
      <div id="map" style={{width: "100vw", height: "100vh"}}></div>
    </div>
  );
};

export default UsPresidentElectionResult;