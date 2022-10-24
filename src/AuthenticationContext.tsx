import {
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useContext,
	useState
} from 'react'

const AuthContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>(
	[false, () => null]
)

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	return (
		<AuthContext.Provider value={[isAuthenticated, setIsAuthenticated]}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
