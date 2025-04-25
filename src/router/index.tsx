import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BasicLayout from 'src/layouts/BasicLayout'
import LoginPage from 'src/components/LoginPage'
import NotFound from 'src/components/NotFound'
import Home from 'src/pages/Home'
import About from 'src/pages/About'

// 检查是否登录的函数
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
}

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  if (!isAuthenticated()) {
    return <Navigate to='/login' replace />
  }
  return children
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />}/>
        <Route 
          path='/' 
          element={
            <PrivateRoute>
              <BasicLayout/>
            </PrivateRoute>
          }
        >
          <Route path='/' element={<Navigate to='/home' />}/>
          <Route path='/home' element={<Home/>} index={true} />
          <Route path='/about' element={<About/>}/>
        </Route>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App