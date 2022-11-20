import React, {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useState
} from 'react'

const AuthContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>(
	[false, () => null]
)

export const withAuth = (component: () => React.ReactNode) => {
	return function AuthWrapper() {
		const [isAuthenticated, setIsAuthenticated] = useState(false)
		return (
			<AuthContext.Provider value={[isAuthenticated, setIsAuthenticated]}>
				{component()}
			</AuthContext.Provider>
		)
	}
}

export const useAuth = () => useContext(AuthContext)
