import React, { Component } from 'react';

import PropTypes from 'prop-types';

const CitiesView = ({ onCityClick, name, children }) => {
	return (
		<li>
			<span
				className="klk city"
				onClick={onCityClick}
			>
				{name}
			</span>
			{children}
		</li>
	);
};

export default CitiesView;
