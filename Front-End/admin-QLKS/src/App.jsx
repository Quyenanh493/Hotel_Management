import './App.scss'
import AllRoute from './components/AllRoute'
import { PermissionProvider } from './contexts/PermissionContext'

function App() {
  return (
    <PermissionProvider>
      <AllRoute />
    </PermissionProvider>
  )
}

export default App
