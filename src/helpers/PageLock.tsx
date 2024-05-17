import React, { ComponentType } from "react";
import { AuthHelper } from "./AuthHelper";
import { useNavigate } from "react-router-dom";

interface Props {}

export const PageLock = <P extends Props>(
	WrappedComponent: ComponentType<P>
) => {
	const PageLockWrapper: React.FC<P> = (props) => {
		const navigate = useNavigate();
		const { loading, authenticated } = AuthHelper();

		if (loading) {
			// You can render a loading spinner or message while authentication check is in progress
			return (
				<div className="flex justify-center items-center h-screen">
					<div className="loader"></div>
				</div>
			);
		}

		if (!authenticated) {
			// If user is not authenticated, redirect to the login page
			navigate("/login");
			return null; // Render nothing while redirecting
		}

		// If user is authenticated, render the wrapped component
		return <WrappedComponent {...props} />;
	};

	return PageLockWrapper;
};
