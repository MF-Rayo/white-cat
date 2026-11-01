import { useMemo, useState } from "react";

import { 
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapClusterLayer, 
  MapPopup, 
  MapControls
} from "@/components/ui/map/Map";

import { Panel } from "@/components/ui/Panel";
import { IocDetails } from "@/components/ui/details/screenshot"

export default function IocMap({ data }) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Convertir a formato GeoJSON 
  const geojson = useMemo(() => ({
    type: "FeatureCollection",
    features: data.ioc_reported
      .filter((loc) => loc.lat != null && loc.lon != null)
      .map((loc) => ({
      type: "Feature",
      geometry: {
          type: "Point",
          coordinates: [loc.lon, loc.lat], 
      },
      //Datos a mostrar en el poppup
      properties: {
        ioc               : loc.ioc,
        tags              : loc.tags,
        ioc_type          : loc.ioc_type,
        threat_type       : loc.threat_type,
        reporter          : loc.reporter,
        confidence_level  : loc.confidence_level,
        reference         : loc.reference,
        screenshot        : loc.screenshot,
        scan_date         : loc.scan_date,
        report            : loc.report,
        http_status       : loc.http_status,
        title             : loc.title,
        ip                : loc.ip,
        asn               : loc.asn,
        asn_name          : loc.asn_name,
        server            : loc.server
      },
      })),
    }),
    [data]
  );

  return (
    <Panel title="IOC MAP" className="min-h-[50vh]">
        <Map styles={{ dark: "https://tiles.openfreemap.org/styles/dark" }}>
      
          <MapClusterLayer
          data={geojson}
          clusterRadius={50}
          clusterMaxZoom={14}
          clusterColors={[
              "#10b981", 
              "#f59e0b", 
              "#ef4444"
          ]}
          pointColor="#38bdf8"
          onPointClick={(feature, coordinates) => {
              setSelectedPoint({
                  coordinates,
                  properties: feature.properties,
              });
          }}
          />

          {selectedPoint && (
            <MapPopup
                key={`${selectedPoint.coordinates[0]}-${selectedPoint.coordinates[1]}`}
                longitude={selectedPoint.coordinates[0]}
                latitude={selectedPoint.coordinates[1]}
                onClose={() => setSelectedPoint(null)}
                closeOnClick={false}
                focusAfterOpen={false}
                closeButton
            >
                <IocDetails data={selectedPoint.properties} />
            </MapPopup>
          )}

          <MapControls position="top-right" showZoom showCompass showFullscreen />
        </Map>
    </Panel>
  );
}





export function DashboardMap({ data }) {
    return (
        <Panel title="IOC MAP" className="min-h-[50vh]">
            <Map styles={{ dark: "https://tiles.openfreemap.org/styles/dark" }}>
                {data.tops.source.map((location) => (
                <MapMarker
                    key={location.country}
                    longitude={location.lon}
                    latitude={location.lat}
                >
                    <MarkerContent>
                        <div className="bg-(--danger-color)/20 size-4 rounded-full border-1 border-(--danger-color) shadow-lg" />
                    </MarkerContent>
                    <MarkerTooltip>{location.country}</MarkerTooltip>
                </MapMarker>
                ))}
                <MapControls position="top-left" showZoom showCompass />
            </Map>
        </Panel>
    );
}