import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import { setCurrentUser, logoutUser } from './actions/authActions'
import { clearCurrentProfile } from './actions/profileActions'
import setAuthToken from './utils/setAuthToken'

import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute';

import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import CreateProfile from './components/create-profile/CreateProfile';

// Check for token
if (localStorage.jwtToken) {
	// Set auth token
	setAuthToken(localStorage.jwtToken)
	// Decode token to get user data
	const decoded = jwt_decode(localStorage.jwtToken)
	// set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded))

	//Check for expired token
	const currentTime = Date.now() / 1000
	if (decoded.exp < currentTime) {
		// Logout user
		store.dispatch(logoutUser())
		// Clear current profile
		store.dispatch(clearCurrentProfile());
		// Redirect to login 
		window.location.href = '/login'
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className="App">
						<Navbar />
						<Route exact path="/" component={Landing} />
						<div className="container">
							<Route exact path="/register" component={Register} />
							<Route exact path="/login" component={Login} />
							<Switch>
								<PrivateRoute exact path="/dashboard" component={Dashboard} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/create-profile" component={CreateProfile} />
							</Switch>
						</div>
						<Footer />
					</div>
				</Router>
			</Provider>

		);
	}
}

export default App;
