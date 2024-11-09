import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import useMapPointerMove, { MapPointerMoveEventHandler } from "../../hooks/useMapPointerMove";
import { getStateResult } from "../us-president-election-result/utilities";
import { default as OlMap } from 'ol/Map';
import Overlay, { Positioning } from 'ol/Overlay';
import { Pixel } from "ol/pixel";
import { ElectionResult } from "../types/result";
import "./election-result-popup.css";
import ResultPopupTable from "../result-popup-table/result-popup-table";


interface ElectionResultPopupProps {
  map: MutableRefObject<OlMap | undefined>;
  popup: Overlay | null;
  addOverlay: (overlay: Overlay) => void; 
}

const popupWidth: number = 450; 
const popupHeight: number = 300; 

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
      <div className="ol-popup-content">
        {stateResult?.stateName}
        {/* <ResultChart result={stateResult!} /> */}
        <ResultPopupTable result={stateResult!} />
      </div>
    </div>
  );
};

export default ElectionResultPopup;