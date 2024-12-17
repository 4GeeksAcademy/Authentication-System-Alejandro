import React, { useState } from "react";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()
	const [messageError, setMessageError] = useState()
	const [error, setError] = useState(false)
	const navigate = useNavigate()

	const login = async ({ email, password }) => {
		try {
			const respose = await fetch(`${process.env.BACKEND_URL}/api/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					'email': email,
					'password': password
				})
			})
			const resp = await respose.json()
			if (resp.token) {
				localStorage.setItem('token', resp.token)
				//setToken(resp.token)
				navigate('/private')
			}

			if (respose.status !== 200) {
				setError(true)
				setMessageError(resp.error)
			}
		} catch (error) {
			setError(true)
			setMessageError(error)
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		login({ email, password })
	}

	return (
		<div className="d-flex flex-column justify-content-center align-items-center mt-5 form-login">
			<div className="card p-4 shadow" style={{ width: '400px' }}>
				<h3 className="text-center mb-4">Iniciar Sesión</h3>
				<form>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">Email</label>
						<input
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							className="form-control"
							id="email"
							placeholder="email@example.com"
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="inputPassword" className="form-label">Password</label>
						<input
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							className="form-control"
							id="inputPassword"
						/>
						<div id="passwordHelpBlock" className="form-text">
							Si no tienes cuenta <Link to='/signup'>registrate</Link>.
						</div>
					</div>
					<div className="d-grid">
						<button type="submit" className="btn btn-primary" onClick={handleSubmit}>Entrar</button>
					</div>
				</form>
			</div>
			{error && (
				<div className="mt-3 w-50 text-center message-error" role="alert">
					{messageError}
				</div>
			)}
		</div>
	);
};
