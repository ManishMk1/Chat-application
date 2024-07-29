import { useState } from "react"
import Button from "../../components/Button"
import Input from "../../components/Innput"
import {useNavigate} from 'react-router-dom'

function Form({isSignInPage=false}) {
  const [userData,setUserData]=useState({
    ...(!isSignInPage && {
      fullName:''
    }),
    email:'',
    password:''
  })
  const handleSubmit=async(e)=>{
    e.preventDefault();
    console.log(userData);
    const res=await fetch(`http://localhost:8000/api/${isSignInPage?'login':'register'}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(userData)
    })
    if(res.status===400){
      alert("Invalid Credentials");
    }else{
      const resData=await res.json();
    if(resData.token){
      localStorage.setItem('user:token',resData.token);
      localStorage.setItem('user:detail',JSON.stringify(resData.user));
      navigate('/');
    }
    console.log('data:>>',resData);
    }
    

  }
  const navigate=useNavigate();
  return (
    <div className='flex justify-center items-center h-screen bg-secondary'>
      <div className="bg-white w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
      <div className="text-4xl font-bold">
        Welcome{isSignInPage&&", Back"}
      </div>
     
      <div className="text-xl font-light mb-10">{isSignInPage?"Sign in to get Explore":"Sign Up to get started"}</div>
      <form action="" className="flex flex-col items-center  w-full" onSubmit={(e)=>handleSubmit(e)} >
      {!isSignInPage&&<Input label="Full Name" name="name" placeholder="Enter your name" isRequired={true} className="mb-2" value={userData.fullName} onChange={(e)=>setUserData({...userData,fullName:e.target.value})} isClassName="w-1/2" />}

      <Input label="Email Address" name="mail" placeholder="Ex:abc@gmail.com" isRequired={true} className="mb-2" type="email" value={userData.email} onChange={(e)=>setUserData({...userData,email:e.target.value})} isClassName="w-1/2" />

      <Input label="Password" name="password" placeholder="Enter your Password" type="password" isRequired={true} value={userData.password} onChange={(e)=>setUserData({...userData,password:e.target.value})} isClassName="w-1/2" />

      <Button label={isSignInPage?"Sign In":"Sign Up"} className="mt-8 mb-3" type="submit"></Button>
     
      </form>
      <div>{isSignInPage?"Don't have an account?":"Already have an Account?"}<span className="text-primary cursor-pointer underline" onClick={()=>navigate(`/user/${isSignInPage?'sign_up':'sign_in'}`)}> {isSignInPage?"Sign Up":"Sign in"}</span> </div>

    </div>
    </div>
    
  )
}

export default Form