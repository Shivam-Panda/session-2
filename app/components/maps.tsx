import * as React from 'react';
import Map from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import { HexagonLayer } from 'deck.gl';

export default function MAP() {
    // Add 3 more Datasets
    const layers = [
        new HexagonLayer<any>({
            id: 'heatmap',
            data: 'https://data.cityofnewyork.us/resource/5rq2-4hqu.json?$limit=1000',
            elevationRange: [0, 3000],
            extruded: true,
            getPosition: (d) => {
                return [d.the_geom.coordinates[0], d.the_geom.coordinates[1]];
            },
            elevationScale: 4,
            radius: 200,
            pickable: true,
        }),
    ];

    return (
        <DeckGL
            initialViewState={{
                longitude: -122.4,
                latitude: 37.8,
                zoom: 4,
            }}
            layers={layers}
            style={{
                width: '600px',
                height: '400px',
                position: 'relative',
            }}
            controller={true}
        >
            <Map
                mapboxAccessToken="pk.eyJ1Ijoic29wYW5kYTI1IiwiYSI6ImNtMG12aXVlYjA2anEya29waGF0Z2drZGsifQ.ax4Zfd4tVFizHDA379gfZQ"
                mapStyle="mapbox://styles/mapbox/streets-v9"
            />
        </DeckGL>
    );
}
