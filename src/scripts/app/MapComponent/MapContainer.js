import {
	GoogleMap,
	InfoWindow,
	Marker,
	withGoogleMap,
	withScriptjs,
} from 'react-google-maps';
import React, { Component } from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';

// import AddressesList from './AddressesList';
import { FavoritGoogleMap } from './FavoritGoogleMap';
import OblastContainer from '../Containers/Oblast';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { regions } from '../../data/address-uk-favoritsport';

const DEFAULT_MAP_CENTER = [30.523756, 50.450761];

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
		zoom: 12,
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

	oblastRender = () => {
		return _.map(this.state.addresses, (oblast, index) => {
			return (
				<OblastContainer
					key={index}
					oblast={oblast}
					onPointClick={this.onPointClick}
				/>
			);
		});
	}

	render() {
		return (
			<div>
				<FavoritGoogleMap
					mapLoaded={this.mapLoaded}
					isMarkerShown={this.state.isMarkerShown}
					onMarkerClick={this.handleMarkerClick}
					zoom={this.state.zoom}
					center={this.state.center}
					coordinates={this.state.coordinates}
					OpenInfowindowForMarker={this.OpenInfowindowForMarker}
					isInfoWindowOpen={this.state.isInfoWindowOpen}
					zoomChanged={this.onMapZoomChanged}
					infoWindowToggle={this.infoWindowToggle}
					markersIndex={this.state.markersIndex}
				/>
				<div>
					<ul className="menu">
						{this.oblastRender()}
					</ul>
				</div>
			</div>
		);
	}
}

export default MapContainer;
