import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AuthState {
	loading: boolean;
	authenticated: boolean;
}

export const AuthHelper = (): AuthState => {
	const [authState, setAuthState] = useState<AuthState>({
		loading: true,
		authenticated: false,
	});

	const navigate = useNavigate();

	useEffect(() => {
		const checkAuthentication = async () => {
			try {
				// Check if user is authenticated by making a request to a protected route
				await axios.get("/api/protected-route");
				// If the request succeeds, the user is authenticated
				setAuthState({ loading: false, authenticated: true });
			} catch (error) {
				// If the request fails, the user is not authenticated
				setAuthState({ loading: false, authenticated: false });
				// Redirect to login page
				navigate("/login");
			}
		};

		checkAuthentication();
	}, [navigate]);

	return authState;
};
