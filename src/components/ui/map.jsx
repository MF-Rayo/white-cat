import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet"
import { useRef, useEffect, useMemo} from "react"

const COLORS = [
    "var(--bar_a)",
    "var(--bar_b)",
    "var(--bar_c)",
    "var(--bar_d)",
    "var(--bar_e)",
    "var(--bar_f)",
    "var(--bar_g)",
    "var(--bar_h)",
    "var(--bar_i)",
    "var(--bar_j)",
]

function hashToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
}

function makeIcon(color) {
    return L.divIcon({
        className: "",
        html: `<div style="
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: color-mix(in srgb, ${color} 40%, transparent);
            border: 1px solid ${color};
            box-sizing: border-box;
        "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    })
}

function row(color, label, value) {
    if (!value) return ""
    return `<div style="display:flex;gap:6px;margin-bottom:3px">
        <span style="color:${color};min-width:80px;flex-shrink:0">${label}:</span>
        <span style="color:var(--text-color);word-break:break-all;overflow-wrap:anywhere">${value}</span>
    </div>`
}

import { useNavigate } from "react-router-dom";

function ThreatMarkers({ data }) {
    const map = useMap()
    const navigate = useNavigate()
    const clusterRef = useRef(null)

    // clipboard 
    useEffect(() => {
        window.__analyzeInSandbox = async (iocValue) => {
            try {
                await navigator.clipboard.writeText(iocValue);
            } catch {
            }
            navigate(`/web/sanbox?paste=1`);
        };

        return () => {
            delete window.__analyzeInSandbox;
        };
    }, [navigate])

    useEffect(() => {

        if (clusterRef.current) {
            map.removeLayer(clusterRef.current)
            clusterRef.current = null
        }

        if (!data.length) return

        const cluster = L.markerClusterGroup({
            maxClusterRadius: 40,
            chunkedLoading: true,
        })

        data.forEach(item => {
            const lat = item.lat
            const lon = item.lon ?? item.long ?? item.longitude

            const key = item.malware_printable || item.malware || item.threat_type || "unknown"
            const color = hashToColor(key)
            const marker = L.marker([lat, lon], { icon: makeIcon(color) })

            marker.bindPopup(`
                <div style="font-family: 'Poppins', sans-serif; font-size: 12px; min-width: 260px; background: color-mix(in srgb, var(--bg-color) 60%, transparent); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(20px); padding: 5%; border: 1px solid ${color}; border-radius: 14px;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                    <span style="width:9px;height:9px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color}88;flex-shrink:0"></span>
                    <span style="color:${color};font-weight:bold">${key}</span>
                </div>
                ${row(color, item.ioc_type || "IOC", `<code>${item.ioc_value}</code>`)}
                ${row(color, "IP", item.ip)}
                ${row(color, "Reporter", item.reporter)}
                ${row(color, "Country", item.country)}
                ${row(color, "City", item.city)}
                ${row(color, "Type", item.threat_type)}
                ${row(color, "UTC", item.first_seen_utc)}
                ${row(color, "Confidence", item.confidence_level != null ? `${item.confidence_level}%` : null)}
                ${item.reference ? row(color, "Ref", `<a href="${item.reference}" target="_blank" style="color:${color}">${item.reference}</a>`) : ""}
                    <div style="margin-top:10px">
                        <button
                        onclick="window.__analyzeInSandbox('${item.ioc_value}')"
                        style="width:100%;padding:6px 0;border:1px solid ${color};border-radius:8px;background:transparent;color:${color};font-weight:bold;cursor:pointer;font-family:inherit;font-size:inherit"
                        >
                            Analizar (Sandbox)
                        </button>
                    </div>
                </div>
            `, { maxWidth: 400 })

            cluster.addLayer(marker)
        })

        map.addLayer(cluster)
        clusterRef.current = cluster

        return () => {
            if (clusterRef.current) {
                map.removeLayer(clusterRef.current)
                clusterRef.current = null
            }
        }
    }, [data, map])

    return null
}


function Legend({ data }) {

    const entries = useMemo(() => {
        const names = new Set(
            data.map(item =>
                item.malware_printable || item.malware || item.threat_type || "unknown"
            )
        )
        return [...names]
            .sort()
            .map(name => [name, hashToColor(name)])
    }, [data])

    return (
        <div style={{
            position: "absolute", bottom: "5%", right: 0, zIndex: 1000,
            background: "color-mix(in srgb, var(--bg-color) 60%, transparent)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--border-color)", borderRadius: "15px",
            padding: "12px 14px", minWidth: "200px", maxWidth: "600px", maxHeight: "400px",
            overflowY: "auto", fontFamily: "monospace", fontSize: "11px"
        }}>
            <p style={{ color: "var(--primary-color)", fontWeight: "bold", marginBottom: 8, letterSpacing: "0.1em", margin: "0 0 8px" }}>
                Threat Legend
            </p>
            {entries.map(([name, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                    <span style={{
                        width: 8, 
                        height: 8, 
                        borderRadius: "50%", 
                        background: `color-mix(in srgb, ${color} 40%, transparent)`, 
                        border: `1px solid ${color}`,
                        boxSizing: "border-box",
                        flexShrink: 0
                    }} />
                    <span style={{
                        color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: "nowrap", maxWidth: 150
                    }}>{name}</span>
                </div>
            ))}
        </div>
    )
}

export function ThreatMap({ apiData }) {
    const data = apiData.read();
    return (
        <>
            <MapContainer
                center={[20, 0]}
                zoom={2}
                minZoom={2}
                maxZoom={16}
                maxBounds={[[-90, -180], [90, 180]]}
                attributionControl={false}
                maxBoundsViscosity={1.0}
                style={{ height: "100%", width: "100%", background: "#232227" }}
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={16}
                    bounds={[[-90, -180], [90, 180]]}
                    keepBuffer={4}
                    errorTileUrl="data:image/png;base64,iVBORw0KGgo="
                    noWrap={true} />
                <ThreatMarkers data={data} />
            </MapContainer>
            <Legend data={data} />
        </>
    );
}




function makeIconTop(color, size = 16) {
    return L.divIcon({
        html: `<div style="
            background:${color};
            width:${size}px;
            height:${size}px;
            border-radius:50%;
            background: color-mix(in srgb, ${color} 40%, transparent);
        "></div>`,

        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    })
}


function CountryMarkers({ data }) {
    if (!data?.length) return null

    const counts = data.map(d => d.requests ?? d.count ?? 1)
    const maxCount = Math.max(...counts, 1)

    return data.map((item, i) => {
        const { lat, lon, long, longitude, country } = item
        const lng = lon ?? long ?? longitude
        if (lat == null || lng == null) return null

        const count = item.requests ?? item.count ?? 1
        const color = COLORS[i % COLORS.length]
        const size = 16 + (count / maxCount) * 10

        return (
            <Marker
                key={item.ip || country || i}
                position={[lat, lng]}
                icon={makeIconTop(color, size)}
            />
        )
    })
}

export function SimpleMap({ data }) {
    return (
        <MapContainer
            center={[20, 0]}
            zoom={1}
            minZoom={0}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            boxZoom={false}
            keyboard={false}
            dragging={false}
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
            style={{
                width: "100%",
                height: "100%",
                background: "#232227",
            }}
        >
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                noWrap={true}
            />
            <CountryMarkers data={data} />
        </MapContainer>
    )
}