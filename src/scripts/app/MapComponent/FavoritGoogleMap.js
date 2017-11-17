import {
	GoogleMap,
	InfoWindow,
	Marker,
	withGoogleMap,
	withScriptjs,
} from 'react-google-maps';
import React, { Component } from 'react';
import { compose, withHandlers, withProps, withState, withStateHandlers } from 'recompose';

import { Logger } from 'redux-saga';
import PropTypes from 'prop-types';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import _ from 'lodash';

const GOOGLE_API_KEY = 'AIzaSyCuAfuuTqi6egha5XIV6tcFH59CCLpFvwk';

export const FavoritGoogleMap = compose(
	withProps({
		googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
		loadingElement: <div style={{ height: '100%' }} />,
		containerElement: <div style={{ height: '400px' }} />,
		mapElement: <div style={{ height: '100%' }} />,
	}),
	withScriptjs,
	withGoogleMap,
)(props => {
	return (
		<GoogleMap
			ref={props.mapLoaded}
			zoom={props.zoom}
			center={props.center}
			onZoomChanged={props.zoomChanged}
		>
			{props.isMarkerShown && props.coordinates.map((address, index) => {
				const infoWindowToggle = () => props.infoWindowToggle({ index, center: address.center });

				return (
					<Marker
						key={address.name}
						position={{ lat: address.center[1], lng: address.center[0] }}
						defaultAnimation={2}
						defaultTitle={address.name}
						onClick={infoWindowToggle}
					>
						{props.markersIndex[index] && (
							<InfoWindow
								onCloseClick={infoWindowToggle}
								position={{ lat: address.center[1], lng: address.center[0] }}
							>
								<div>
									{address.img &&
										<div>
											<img src={`/static/media/themes/maps/img/${address.img}.jpg`} alt={address.name} />
										</div>
									}
									<span>{address.name}</span>
								</div>
							</InfoWindow>
						)}
					</Marker>
				);
			})}
		</GoogleMap>
	);
});
