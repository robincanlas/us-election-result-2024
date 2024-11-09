// https://api-election.cbsnews.com/api/public/races2/2024/G?filter.office=P
// https://eric.clst.org/tech/usgeojson/

import {  useEffect } from "react";
import useOlMap from "../hooks/useOlMap";
import usGeojsonData from './gz_2010_us_040_00_20m.json';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import useMapPointerMove from "../hooks/useMapPointerMove";
import {  handleMouseMove, styleFunction } from "./utilities";
import ElectionResultPopup from "../election-result-popup/election-result-popup";
import "./us-president-election-result.css";

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