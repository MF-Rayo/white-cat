import { useMemo, useState } from "react";

import { 
    Map,
    MapMarker,
    MarkerContent,
    MarkerPopup,
    MarkerTooltip,
    MapClusterLayer, 
    MapPopup, 
    MapControls
} from "@/components/ui/map";

import { Panel } from "@/components/ui/panel";

export default function IocMap({ data }) {
    const [selectedPoint, setSelectedPoint] = useState(null);

  // Convertir a formato GeoJSON 
    const geojson = useMemo(
        () => ({
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
                ioc: loc.ioc,
                tags: loc.tags,
                ioc_type: loc.ioc_type,
                threat_type: loc.threat_type,
                reporter: loc.reporter,
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
            pointColor="#00d4ff"
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
                className="!bg-transparent !p-0 !shadow-none"
            >
                <div className="bg-(--bg-color) border border-(--border-color) p-4 rounded-(--radius-button)">
                    <div className="space-y-2 text-(--text-secondary)">
                        <p><strong className="text-(--text-color)">IOC:</strong> {selectedPoint.properties.ioc}</p>
                        <p><strong className="text-(--text-color)">Tag:</strong> {selectedPoint.properties.tags}</p>
                        <p><strong className="text-(--text-color)">IOC Type:</strong> {selectedPoint.properties.ioc_type}</p>
                        <p><strong className="text-(--text-color)">Threat Type:</strong> {selectedPoint.properties.threat_type}</p>
                        <p><strong className="text-(--text-color)">Reported:</strong> {selectedPoint.properties.reporter}</p>
                    </div>
                </div>
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
                        <div className="bg-(--info-color)/20 size-4 rounded-full border-1 border-(--info-color) shadow-lg" />
                    </MarkerContent>
                    <MarkerTooltip>{location.country}</MarkerTooltip>
                </MapMarker>
                ))}
            </Map>
        </Panel>
    );
}