import compose from 'compose-function'

import { useAuth, withAuth } from './with-auth'
import { withRouter } from './with-router'

export const withProviders = compose(withRouter, withAuth)
export { useAuth }
