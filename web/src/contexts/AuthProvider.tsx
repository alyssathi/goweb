import React, { ReactNode, useState } from "react";
import { useContext } from "react";

//custom context to provide Auth data
export const AuthContext = React.createContext({} as AuthContextI);

interface AuthProviderI {
	children: ReactNode;
}

//can call any of these exports outside of the React Functional Component directly from this file
export interface AuthCurrentUserI {
	name: string | null;
	username: string | null;
	email: string | null;
}

interface AuthContextI {
	isLoggedIn: boolean;
	currentUser: AuthCurrentUserI;
	setCurrentUser: React.Dispatch<React.SetStateAction<AuthCurrentUserI>>;
}

export default function AuthProvider({ children }: AuthProviderI) {
	const isLoggedIn = document.cookie.includes("session");
	const [currentUser, setCurrentUser] = useState<AuthCurrentUserI>({
		name: null,
		username: null,
		email: null,
	});

	const value = {
		isLoggedIn,
		currentUser,
		setCurrentUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

//to use any of the values, we can just call this function and destructure the value that you want. See src/utils/getState.tsx for example.
export function useAuth() {
	return useContext(AuthContext);
}
