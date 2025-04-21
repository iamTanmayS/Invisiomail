import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import {Provider} from "react-redux"
import { Store } from './Redux/Store/Store'
function App() {


  return (
    
    <Provider store = {Store}>
    <BrowserRouter>
    <AppRoutes/>
    </BrowserRouter>
      </Provider>
    
  )
}

export default App
