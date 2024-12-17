import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate()
	const token = localStorage.getItem('token')

	const handleClick = () => {
		localStorage.removeItem('token')
		navigate('/')
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>
				<div className="ml-auto">
					{token
					? <div>
						<Link to="/private">
							<button className="btn btn-primary">Go private</button>
				  	  	</Link>
						<button className="btn btn-danger" onClick={handleClick}>Logout</button>
					  </div>
					: <div>
						<Link to="/login">
							<button className="btn btn-success">Login</button>
						</Link>	
						<Link to="/signup">
							<button className="btn btn-primary">Signup</button>
						</Link>	
					  </div>}
				</div>
			</div>
		</nav>
	);
};
