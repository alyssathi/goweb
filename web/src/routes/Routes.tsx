import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { HomePage, RegisterPage, LoginPage, Dashboard, Profile } from "../pages";
import { PrivateRoute } from "./PrivateRoute";

const Routes = () => {
	return (
		<Router>
			<Switch>
				<Route path="/registration" component={RegisterPage} />
				<Route path="/login" component={LoginPage} />
				<PrivateRoute path="/dashboard" component={Dashboard} />
				<PrivateRoute path="/profile" component={Profile} />
				<Route path="/" component={HomePage} />
			</Switch>
		</Router>
	);
};

export default Routes;
