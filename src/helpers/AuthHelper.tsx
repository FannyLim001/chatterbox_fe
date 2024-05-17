import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthState {
	loading: boolean;
	authenticated: boolean;
}

interface AuthHelperReturnType extends AuthState {
	setAuthenticated: (authenticated: boolean) => void;
}

export const AuthHelper = (): AuthHelperReturnType => {
	const [authState, setAuthState] = useState<AuthState>({
		loading: true,
		authenticated: false,
	});

	const navigate = useNavigate();
	const location = useLocation();

	const checkAuthentication = async () => {
		try {
			// Check if user is authenticated by making a request to a protected route
			await axios.get("/be/api/protected-route");
			// If the request succeeds, the user is authenticated
			setAuthState({ loading: false, authenticated: true });
		} catch (error) {
			// If the request fails, the user is not authenticated
			setAuthState({ loading: false, authenticated: false });
			// Redirect to login page only for protected routes
			if (location.pathname !== "/register") {
				navigate("/login");
			}
		}
	};

	useEffect(() => {
		checkAuthentication();
	}, [navigate]);

	const setAuthenticated = (authenticated: boolean) => {
		setAuthState({ ...authState, authenticated });
	};

	return { ...authState, setAuthenticated };
};
