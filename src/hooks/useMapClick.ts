import { useCallback, useEffect } from "react";
import { default as OlMap } from 'ol/Map';

export interface MapClickEventHandler {
  originalEvent: UIEvent | { clientX: number; clientY: number; };
}

interface useMapClickProps {
  map: OlMap;
  handler: (event: MapClickEventHandler, map: OlMap) => void;
}

const useMapClick = ({
  map,
  handler
}: useMapClickProps) => {
  const handleClick = useCallback((event: MapClickEventHandler) => {
    handler(event, map);
  }, [map]);

  useEffect(() => {
    const olMap = map;

    olMap?.on('click', handleClick);

    return () => {
      olMap?.un('click', handleClick);
    }
  }, [handleClick, map]);
};

export default useMapClick;