import React, { Component } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { loginUser } from '../../actions/authActions'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	componentWillReceiveProps(newProps) {
		if (newProps.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
		if (newProps.errors) {
			this.setState({ errors: newProps.errors })
		}
	}

	onSubmit(event) {
		event.preventDefault();

		const user = {
			email: this.state.email,
			password: this.state.password
		};

		this.props.loginUser(user)
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="login">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Log In</h1>
							<p className="lead text-center">
								Sign in to your DevConnector account
							</p>
							<form noValidate onSubmit={this.onSubmit}>
								<div className="form-group">
									<input
										type="email"
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.email
										})}
										placeholder="Email Address"
										name="email"
										value={this.state.email}
										onChange={this.onChange}
									/>
									{errors.email && (
										<div className="invalid-feedback">{errors.email}</div>
									)}
								</div>
								<div className="form-group">
									<input
										type="password"
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.password
										})}
										placeholder="Password"
										name="password"
										value={this.state.password}
										onChange={this.onChange}
									/>
									{errors.password && (
										<div className="invalid-feedback">{errors.password}</div>
									)}
								</div>
								<input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
}

const mapStatetoProps = (state) => ({
	auth: state.auth,
	errors: state.errors
})

export default connect(mapStatetoProps, { loginUser })(withRouter(Login));
