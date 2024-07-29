import DashBoard from "./modules/Dashboard"
import Form from "./modules/Form"
import {Routes,Route,Navigate} from 'react-router-dom'
import NotFound from "./modules/Form/NotFound"

function App() {
  const ProtectedRoutes=({children,auth=false})=>{
    const isLoggedIn=localStorage.getItem('user:token')!==null||false
    if(!isLoggedIn&& auth){
      return <Navigate  to={'/user/sign_in'} />
    }else if(isLoggedIn&&['/user/sign_in','/user/sign_up'].includes(window.location.pathname)){
      return <Navigate to={'/'}/>
    }
    return children
  }
  return (
    <>
     <Routes>
      <Route path="/" element={ 
        <ProtectedRoutes auth={true}>
        <DashBoard/>
        </ProtectedRoutes>
        } />
      <Route path='/user/sign_in' element={
        <ProtectedRoutes>
          <Form isSignInPage={true}/>
        </ProtectedRoutes>
      }/>
      <Route path='/user/sign_up' element={ <ProtectedRoutes>
          <Form isSignInPage={false}/>
        </ProtectedRoutes>}/>
        <Route path="*" element={<NotFound/>}>

        </Route>
     </Routes>
    
    </>
  )
}

export default App
