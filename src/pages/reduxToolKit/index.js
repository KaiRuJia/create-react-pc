import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'

const RTK = () => {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  )
}

export default RTK