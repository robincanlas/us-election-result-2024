import { useCallback, useEffect } from "react";
import { default as OlMap } from 'ol/Map';

export interface MapPointerMoveEventHandler {
  originalEvent: UIEvent | { clientX: number; clientY: number; };
  coordinate: number[];
}

interface useMapPointerMoveProps { 
  map: React.MutableRefObject<OlMap | undefined>;
  handler: (event: MapPointerMoveEventHandler, map: OlMap) => void;
}

const useMapPointerMove = ({
  map,
  handler
}: useMapPointerMoveProps) => {
  const handlePointerMove = useCallback((event: MapPointerMoveEventHandler) => {
    if (!map.current) return;
    handler(event, map.current);
  }, [map, handler]);

  useEffect(() => {
    const olMap = map.current;

    if (!olMap) return;
    // change mouse cursor when over marker
    olMap?.on('pointermove', handlePointerMove);

    return () => {
      olMap?.un('pointermove', handlePointerMove);
    }
  }, [handlePointerMove, map]);

};

export default useMapPointerMove;