import React, { Component } from 'react';

import CitiesView from '../Views/City';
import PointView from '../Views/Point';
import PropTypes from 'prop-types';
import _ from 'lodash';

class CitiesList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			folded: true,
		};
	}

	onCityClick = () => {
		this.setState({
			folded: !this.state.folded,
		});
	}

	pointsRender = (addresses, onPointClick) => {
		return (
			<ul className="level2">
				{_.map(addresses, (address, index) => {
					return (
						<PointView
							key={index}
							name={address.name}
							onPointClick={() => onPointClick(address.name, address.center)}
						/>
					);
				})}
			</ul>
		);
	}

	render() {
		const {
			city,
			onPointClick,
		} = this.props;

		return (
			<CitiesView
				name={city.name}
				onCityClick={() => this.onCityClick()}
			>
				{
					!this.state.folded
						? this.pointsRender(city.addresses, onPointClick)
						: null
				}
			</CitiesView>
		);
	}
}
export default CitiesList;
