import * as React from 'react';
import Map from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import { HexagonLayer } from 'deck.gl';

interface hospital {
    rate: number;
    geom: {
        coordinates: [number, number];
    };
}

const glConfig: Record<
    'nyc' | 'sf' | 'mi' | 'pa',
    {
        initialViewState: {
            longitude: number;
            latitude: number;
            zoom: number;
        };
        radius: number;
        data: string;
        getPosition: (d: any) => [number, number];
        getElevationValue?: any;
        getElevationWeight?: any;
    }
> = {
    nyc: {
        data: 'https://data.cityofnewyork.us/resource/5rq2-4hqu.json?$limit=1000',
        getPosition: (d) => d.the_geom.coordinates,
        initialViewState: {
            longitude: -74.01,
            latitude: 40.75,
            zoom: 10,
        },
        radius: 200,
    },
    mi: {
        radius: 2000,
        data: 'https://external-api-city-project.vercel.app/mi',
        getPosition: (d) => {
            return d.geom.coordinates;
        },
        initialViewState: {
            zoom: 7,
            longitude: -84,
            latitude: 43,
        },
        getElevationValue: (d: any) => {
            let sum = 0;
            for (let i = 0; i < d.length; i++) {
                sum += d[i].rate;
            }
            return (sum / d.length) * 100;
        },
    },
    sf: {
        radius: 500,
        data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
        getPosition: (d: any) => d.COORDINATES,
        initialViewState: {
            longitude: -122.0,
            latitude: 38,
            zoom: 8,
        },
        getElevationWeight: (d: any) => d.SPACES,
    },
    pa: {
        radius: 500,
        data: 'https://data.pa.gov/resource/wmgc-6qvd.json',
        getPosition: (d: any) => {
            if (d.geocoded_column) {
                return d.geocoded_column.coordinates;
            }
            return null;
        },
        initialViewState: {
            longitude: -77.2,
            latitude: 41.2,
            zoom: 10,
        },
        getElevationValue: (d: any) => {
            let sum = 0;
            for (let i = 0; i < d.length; i++) {
                sum += parseInt(d[i].incident_count);
            }
            console.log(sum / d.length);
            return (sum / d.length) * 1000;
        },
    },
};

export default function MAP({
    cityDataID,
}: {
    // cityDataID: 'nyc' | 'mi' | 'sf' | 'pa';
    cityDataID: string;
}) {
    const selectedConfig = glConfig[cityDataID];
    const layers = [
        new HexagonLayer<any>({
            id: cityDataID,
            data: selectedConfig.data,
            elevationRange: [0, 3000],
            extruded: true,
            getPosition: selectedConfig.getPosition,
            elevationScale: 4,
            radius: selectedConfig.radius,
            pickable: true,
            // getElevationValue: selectedConfig.getElevationValue,
            // getElevationWeight: selectedConfig.getElevationWeight,
        }),
        // new HexagonLayer<hospital>({
        //     id: 'michigan',
        //     data: 'https://external-api-city-project.vercel.app/mi',
        //     elevationRange: [0, 3000],
        //     extruded: true,
        //     getPosition: (d) => {
        //         return d.geom.coordinates;
        //     },
        //     getElevationValue: (d: any) => {
        //         let sum = 0;
        //         for (let i = 0; i < d.length; i++) {
        //             sum += d[i].rate;
        //         }
        //         return (sum / d.length) * 100;
        //     },
        //     elevationScale: 4,
        //     radius: 2000,
        //     pickable: true,
        // }),
        // new HexagonLayer({
        //     id: 'HexagonLayer',
        //     data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json',
        //     extruded: true,
        //     getPosition: (d: any) => d.COORDINATES,
        //     getColorWeight: (d: any) => d.SPACES,
        //     getElevationWeight: (d: any) => d.SPACES,
        //     elevationScale: 4,
        //     radius: 200,
        //     pickable: true,
        // }),
        // new HexagonLayer({
        //     id: 'PA',
        //     data: 'https://data.pa.gov/resource/wmgc-6qvd.json',
        //     extruded: true,
        //     getPosition: (d: any) => {
        //         if (d.geocoded_column) {
        //             return d.geocoded_column.coordinates;
        //         }
        //         return null;
        //     },
        //     getElevationValue: (d: any) => {
        //         let sum = 0;
        //         for (let i = 0; i < d.length; i++) {
        //             sum += parseInt(d[i].incident_count);
        //         }
        //         console.log(sum / d.length);
        //         return (sum / d.length) * 1000;
        //     },
        //     elevationScale: 4,
        //     radius: 500,
        //     pickable: true,
        // }),
    ];

    return (
        <DeckGL
            initialViewState={selectedConfig.initialViewState}
            layers={layers}
            style={{
                width: '1000px',
                height: '1000px',
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
