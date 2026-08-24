'use client';

import React from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export function MapboxMap({
	longitude = -3.078,
	latitude = 53.377,
	zoom = 15,
	style = 'mapbox://styles/jaddak28/cl03v24lq000p14nywn313x4g',
	height = '60vh',
	width = '100%',
}) {
	return (
		<div style={{ width, height }}>
			<Map
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
				initialViewState={{
					longitude,
					latitude,
					zoom,
				}}
				mapStyle={style}
				style={{ width: '100%', height: '100%' }}
			>
				<Marker longitude={longitude} latitude={latitude} color="black" />
			</Map>
		</div>
	);
}