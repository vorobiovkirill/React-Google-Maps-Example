import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, DEFAULT_MARKER_CLUSTER_GRID_SIZE } from '../Constants/Constants';
import {
	GoogleMap,
	InfoWindow,
	Marker,
	withGoogleMap,
	withScriptjs,
} from 'react-google-maps';
import React, { Component } from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';

import ListOfAddresses from '../Component/ListOfAddresses';
import { MapComponent } from '../Component/MapComponent';
import OblastContainer from './Oblast';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { regions } from '../../data/address-uk-favoritsport';

class MapContainer extends Component {
	state = {
		intervalId: 0,
		map: null,
		isMarkerShown: false,
		addresses: [],
		coordinates: [],
		markersIndex: {},
		center: {
			lat: DEFAULT_MAP_CENTER[1],
			lng: DEFAULT_MAP_CENTER[0],
		},
		zoom: DEFAULT_MAP_ZOOM,
		gridSize: DEFAULT_MARKER_CLUSTER_GRID_SIZE,
		data: [],
	}

	componentWillMount = () => {
		this.delayedShowMarker();

		const newAddresses = this.state.addresses;
		const MapOfAddresses = _.map(regions, (region) => region);
		newAddresses.push(MapOfAddresses);

		const favoritOblast = _.flatMap(regions, 'cities');
		const favoritCity = _.flatMap(favoritOblast, 'addresses');
		const favoritAddressesOfPoints = _.map(favoritCity, 'center');

		this.setState({
			addresses: MapOfAddresses,
			coordinates: favoritCity,
		});
	}

	onPointClick = (name, center) => {
		const index = _.findIndex(this.state.coordinates, { name });
		this.scrollToTop();
		this.setState({
			markersIndex: {
				[index]: !this.state.markersIndex[index],
			},
			center: {
				lat: center[1],
				lng: center[0],
			},
			zoom: 16,
		});
	}

	onMapZoomChanged = (index) => {
		const newZoom = this.state.map.getZoom();
		const markersIndex = this.state.markersIndex;
		this.setState({
			zoom: newZoom,
			markersIndex: {},
		});
		// HACK
		setTimeout(() => {
			this.setState({
				markersIndex,
			});
		}, 300);
	}

	scrollStep() {
		if (window.pageYOffset === 0) {
			clearInterval(this.state.intervalId);
		}
		window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
	}

	scrollToTop() {
		let newIntervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
		this.setState({
			intervalId: newIntervalId,
		});
	}

	handleMarkerClick = () => {
		this.setState({
			isMarkerShown: false,
		});
		this.delayedShowMarker();
	}

	delayedShowMarker = () => {
		setTimeout(() => {
			this.setState({
				isMarkerShown: true,
			});
		}, 1000);
	}

	mapLoaded = (map) => {
		if (this.state.map !== null) {
			return;
		}
		this.setState({
			map,
		});
	}

	infoWindowToggle = ({ center, index }) => {
		this.setState({
			markersIndex: {
				[index]: !this.state.markersIndex[index],
			},
			center: {
				lat: center[1],
				lng: center[0],
			},
			zoom: 16,
		});
	}

	render() {
		return (
			<div>
				<MapComponent
					mapLoaded={this.mapLoaded}
					isMarkerShown={this.state.isMarkerShown}
					onMarkerClick={this.handleMarkerClick}
					center={this.state.center}
					zoom={this.state.zoom}
					gridSize={this.state.gridSize}
					coordinates={this.state.coordinates}
					OpenInfowindowForMarker={this.OpenInfowindowForMarker}
					isInfoWindowOpen={this.state.isInfoWindowOpen}
					zoomChanged={this.onMapZoomChanged}
					infoWindowToggle={this.infoWindowToggle}
					markersIndex={this.state.markersIndex}
				/>
				<ListOfAddresses
					addresses={this.state.addresses}
					onPointClick={this.onPointClick}
				/>
			</div>
		);
	}
}

export default MapContainer;
