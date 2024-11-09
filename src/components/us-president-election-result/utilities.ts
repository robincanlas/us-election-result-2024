import results from "./results.json";
import { Fill, Stroke, Style, Text} from 'ol/style.js';
import Feature, { FeatureLike } from "ol/Feature";
import { default as OlMap } from 'ol/Map';
import { Geometry, MultiPolygon, Polygon } from "ol/geom";
import { MapPointerMoveEventHandler } from "../hooks/useMapPointerMove";

const democratsColor: string = "#0078d4";
const republicansColor: string = "#d13438";
const notVotedColor: string = "#000";

export const getStateResult = (feature: FeatureLike) => {
  const stateName = feature.getProperties()['NAME'];
  if (stateName) {
    return results.find((result) => {
      if (result.stateName.toLowerCase() === stateName.toLowerCase()) {
        return result;
      }
    });
  }
}

const getColor = (feature: FeatureLike) => {
  const stateName = feature.getProperties()['NAME'];
  if (stateName) {
    const state = results.find((result) => {
      if (result.stateName === stateName) {
        return result;
      }
    });
    if (state) {
      const republicansVote = state.candidates.find((candidate) => candidate.lastName.toLowerCase() === 'trump');
      const democratssVote = state.candidates.find((candidate) => candidate.lastName.toLowerCase() === 'harris');

      if (republicansVote && democratssVote) {
        if (republicansVote.vote > democratssVote.vote) {
          return republicansColor;
        } else {
          return democratsColor;
        }
      } else {
        return notVotedColor;
      }
    }
  }
}

const styleTextFunction = (map: OlMap, text?: string) => {
  // const zoom = map.getView().getZoom();
  // const font = (zoom! + 1) * 2;

  return new Text({
    // font: `${font}px Calibri,sans-serif`,
    font: '9.5px Calibri,sans-serif',
    fill: new Fill({
      color: '#fff',
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 0.5
    }),
    // textAlign: "center",
    // textBaseline: "middle",
    text: text,
    overflow: true,
  })
}

const getMaxPoly = (polys: Polygon[]) => {
  const polyObj = [];
  //now need to find which one is the greater and so label only this
  for (const element of polys) {
    polyObj.push({ poly: element, area: element.getArea() });
  }
  polyObj.sort(function (a, b) { return a.area - b.area });

  return polyObj[polyObj.length - 1].poly;
 }

export const styleFunction = (feature: FeatureLike, map: OlMap) => {  
  return [
    new Style({
      fill: new Fill({
        color: getColor(feature),
      }),
      stroke: new Stroke({
        color: 'rgba(255,255,255,0.8)',
        width: 0.25,
      })
    }),
    new Style({
      text: styleTextFunction(map, getStateResult(feature)?.stateCode),
      geometry: function(feature) {
        let retPoint;
        const geom = feature.getGeometry() as Geometry;
        if (geom.getType() === 'MultiPolygon') {
          const multipolygon = geom as MultiPolygon;
          retPoint =  getMaxPoly(multipolygon.getPolygons()).getInteriorPoint();
        } else if (geom.getType() === 'Polygon') {
          const polygon = geom as Polygon;
          retPoint = polygon.getInteriorPoint();
        }
        return retPoint;
      }
    }),
  ];
}

let selected: Feature<Geometry> | null = null;

export const handleMouseMove = (event: MapPointerMoveEventHandler, map: OlMap) => {
  // change mouse cursor when over marker
  if (!map) return;
   const pixel = map.getEventPixel(event.originalEvent);
   if (!pixel) return;
   const hit = map.hasFeatureAtPixel(pixel);
   const target = map.getTargetElement() as HTMLElement;
   if (target) {
      if (hit) { 
        target.style.cursor = 'pointer';
      } else {
        target.style.cursor = '';
      }
   }

  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

  map.forEachFeatureAtPixel(pixel, function (feature) {
    selected = feature as Feature<Geometry>;
    const styles = styleFunction(selected, map);
    styles[0].getStroke()?.setColor('black');
    styles[0].getStroke()?.setWidth(1.5);
    styles[0].setZIndex(2);
    styles[1].setZIndex(3);
    feature = feature as Feature<Geometry>;
    feature.setStyle(styles);
    return true;
  });
 };