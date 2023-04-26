import React, { useEffect, useState } from "react";
import Map, { LngLatBounds, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import starbucksData from "./data/STARBUCKS_DATA.json";
import { IStarbucks } from "./models";
import Supercluster, { PointFeature } from "supercluster";
import "./style.css";
import StarbucksPopup from "./components/StarbucksPopup";

const data: any = starbucksData;

const geoData: PointFeature<IStarbucks>[] = data.items.map(
  (row: IStarbucks) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [row.longitude, row.latitude],
      },
      properties: row,
    };
  }
);

const index = new Supercluster({
  radius: 36,
  maxZoom: 20,
});
index.load(geoData);

function App() {
  const [bounds, setBounds] = useState<LngLatBounds | undefined>();
  const [markers, setMarkers] = useState<any>();
  const [zoom, setZoom] = useState<number>(2);
  const [selectedPoint, setSelectedPoint] =
    useState<null | PointFeature<IStarbucks>>(null);

  useEffect(() => {
    if (!bounds) return;

    const m = index.getClusters(
      [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ],
      zoom
    );

    setMarkers(m);
    console.log(m);
  }, [bounds, zoom]);

  return (
    <>
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        style={{ width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onZoom={(e) => {
          setZoom(e.target.getZoom());
          setBounds(e.target.getBounds());
        }}
        onDrag={(e) => {
          setZoom(e.target.getZoom());
          setBounds(e.target.getBounds());
        }}
      >
        {markers?.map((item: PointFeature<IStarbucks>) => {
          const { point_count: pointCount } = item.properties;
          return (
            <>
              <Marker
                longitude={item.geometry.coordinates[0]}
                latitude={item.geometry.coordinates[1]}
                key={item.id}
              >
                <button
                  className="marker_button"
                  onClick={(e) => {
                    setSelectedPoint(item);
                  }}
                >
                  {pointCount}
                </button>

                {selectedPoint && (
                  <Popup
                    longitude={selectedPoint.geometry.coordinates[0]}
                    latitude={selectedPoint.geometry.coordinates[1]}
                    anchor="bottom"
                    className="popup"
                    closeOnClick={false}
                    onClose={() => setSelectedPoint(null)}
                  >
                    <StarbucksPopup
                      leaves={
                        selectedPoint.id && typeof selectedPoint.id === "number"
                          ? index.getLeaves(selectedPoint.id)
                          : [{ properties: selectedPoint.properties }]
                      }
                    />
                  </Popup>
                )}
              </Marker>
            </>
          );
        })}
      </Map>
    </>
  );
}

export default App;
