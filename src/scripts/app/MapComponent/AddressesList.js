import {
	GoogleMap,
	InfoWindow,
	Marker,
	withGoogleMap,
	withScriptjs,
} from 'react-google-maps';
import React, { Component } from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';

import PropTypes from 'prop-types';
import _ from 'lodash';
import { regions } from '../../data/address-uk-favoritsport';

class AddressesList extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			favoritOblast: {},
		};
	}

	favoritOblastClick = (index) => {
		this.setState({
			favoritOblast: {
				...this.state.favoritOblast,
				[index]: !this.state.favoritOblast[index],
			},
		});
	}

	render() {
		const {
			addresses,
			onAddressClick,
		} = this.props;

		const oblastName = _.map(addresses, (oblast, index) => {
			return (
				<li key={oblast.name}>

					<span className="klk regn" onClick={() => this.favoritOblastClick(index)}>
						{oblast.name}
					</span>

					<ul className={this.state.favoritOblast[index] ? 'level1 active' : 'level1'}>
						{_.map(oblast.cities, (city, name) => {
							return (
								<li key={city.name}>

									<span className="klk city">
										{city.name}
									</span>

									<ul className="level2">
										{_.map(city.addresses, (address, index) => {
											return (
												<li
													key={address.name}
													onClick={() => onAddressClick({ index, center: address.center })}
												>
													{address.name}
												</li>
											);
										})}
									</ul>
								</li>
							);
						})}
					</ul>
				</li>
			);
		});

		return (
			<ul className="menu">
				{oblastName}
			</ul>
		);
	}
}
export default AddressesList;
