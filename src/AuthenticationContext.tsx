import {
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useContext,
	useState
} from 'react'

const AuthContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>(
	[false, () => false]
)

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	return (
		<AuthContext.Provider value={[isAuthenticated, setIsAuthenticated]}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
