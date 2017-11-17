import { BrowserRouter, Link, NavLink, Route, Switch } from 'react-router-dom';
import { Button, Card, Container, Grid, Header, Icon, Image, Item, Label, Menu } from 'semantic-ui-react';
import React, { Component } from 'react';

import MapContainer from './MapComponent/MapContainer';
import PropTypes from 'prop-types';
import _ from 'lodash';

const App = () => {
	return (
		<MapContainer />
	);
};

export default App;
