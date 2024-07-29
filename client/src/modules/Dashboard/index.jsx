import React, { useRef } from 'react'
import { IoCallOutline } from "react-icons/io5";
import Innput from '../../components/Innput'
import { IoIosSend } from "react-icons/io";
import { CiSquarePlus } from "react-icons/ci";
import { useEffect, useState } from 'react'
import {io} from 'socket.io-client'
import Avatar from '../../assets/avatar-svgrepo-com.svg'
function DashBoard() {
  const [user,setUser]=useState(JSON.parse(localStorage.getItem('user:detail')));
  const [conversation,setConversation]=useState([]);
  const [message,setMessage]=useState('');
  const [previousMessage,setPreviousMessage]=useState({});
  const [users,setUsers]=useState([]);
  const [socket,setSocket]=useState(null);
  const messageRef=useRef(null);
  console.log(previousMessage);
  useEffect(()=>{
   messageRef?.current?.scrollIntoView({behavior:'smooth'});
  },[previousMessage.messages])
  useEffect(()=>{
    setSocket(io('http://localhost:8080'));
  },[])
  useEffect(()=>{
    socket?.emit('addUser',user?.id);
    socket?.on('getUsers',users=>{
      console.log('Users:>>',users);
    })
    socket?.on('getMessage',data=>{
      setPreviousMessage(prev=>({
        ...prev,
        messages:[...prev.messages,{user:data.user,message:data.message}]

      }))
    })
  },[socket])
  // useEffect(()=>{
  //   socket?.emit('addUser',user?.id);
  //   socket?.on('getUsers',users=>{
  //     console.log('active users users:>>',users)
  //   })
  //   socket?.on('getMessage', (data) => {
  //     console.log(data)
  //     setPreviousMessage(prev => ({
  //       ...prev,
  //       previousMessage: [...prev.message, { user, message: data.message }]
  //     }));
  //   });
  // },[socket])
  useEffect(()=>{
    const fetchConversations=async()=>{
      const loggedInUser=JSON.parse(localStorage.getItem('user:detail'));
      const res=await fetch(`http://localhost:8000/api/conversation/${loggedInUser.id}`,{
        method:"GET",
        headers:{
          'Content-Type':'application/json',
        },

      });
      const resData=await res.json();
      setConversation(resData);
    }
    fetchConversations();
  },[])
  useEffect(()=>{
    const fetAllUsers=async()=>{
      const res=await fetch(`http://localhost:8000/api/users/${user?.id}`,{
        method:"GET",
        headers:{
          'Content-Type':'application/json',
        },

      });
      const resData=await res.json();
      setUsers(resData);
    }
    fetAllUsers();
  },[])
  const fetchMessages=async(conversationId,receiver)=>{
    const res=await fetch(`http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`,{
      method:"GET",
      // ...(conversationId==='new'&& {
      //   body:JSON.stringify({senderId:user?.id,receiverId:previousMessage?.receiver?.receiverId})}),
      headers:{
        'Content-Type':'application/json',
      },

    })
    const resData=await res.json();
   setPreviousMessage({messages:resData,receiver,conversationId});

  }
  const sendMessage=async(e)=>{
    socket?.emit('sendMessage',{
      conversationId:previousMessage?.conversationId,
      senderId:user?.id,
      message,
      receiverId:previousMessage?.receiver?.receiverId
    })
    const res=await fetch(`http://localhost:8000/api/message`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        conversationId:previousMessage?.conversationId,
        senderId:user?.id,
        message,
        receiverId:previousMessage?.receiver?.receiverId
      })
    });
    setMessage("");
  }
 

  return (
    <div className='w-screen flex'>
        <div className='w-1/4 h-screen bg-secondary'>
        <div>
        <div className='flex justify-center items-center lg:justify-start lg:m-4 my-4 mx-2'>
            <div className='border border-primary rounded-full p-1 hidden sm:block'>
            <img src={Avatar} width={50} height={50} className='rounded-xl '/>
            </div>
          
            <div className='ml-4'>
              <h3  className='text-sm lg:text-2xl'>
                {user?.fullName}
              </h3>
              <p className=' text-sm lg:text-x font-light'>My Account</p>
              
            </div>
           
          </div>
          <hr />
          <div className=''>
          <div className='mx-4 text-primary lg:text-xl'>
            Messages
          </div>
          <div className='max-h-[60vh] w-full mb-4 overflow-y-scroll no-scrollbar'>{
            conversation.length>0?
            conversation.map(({user,conversationId},i)=>{
              return(
                <div key={i} className='' >
                  <div className='flex  items-center lg:justify-start mx-2 lg:m-4 my-4 border-b pb-2'>
                    <div className='flex items-center cursor-pointer' onClick={()=>fetchMessages(conversationId,user)}>
                    <div className='border rounded-full p-1 hidden md:block'>
            <img src={Avatar} width={40} height={40} className='rounded-xl'/>
            </div>
          
            <div className='ml-4'>
              <h3  className='text-sm lg:text-2xl'>
                {user.fullName}
              </h3>
              <p className=' text-[10px] sm:text-sm font-light'>{user.email}</p>
              
            </div>
           
                    </div>
           
          </div>
                </div>
              )
            }):<div className='text-center text-lg font-semibold mt-10'>No Conversation</div>
            }
            </div>
          </div>
    </div>
        </div>
        <div className='w-2/4 h-screen bg-white flex flex-col items-center'>
        <>
        {
          previousMessage.receiver?.fullName &&  <div className='  w-[90%] sm:w-[75%] bg-secondary h-[60px] sm:h-[80px] my-7 rounded-full flex items-center'>
          <div className='flex items-center justify-start border p-1 rounded-full ml-2 sm:ml-6 mr-2 sm:mr-4 cursor-pointer'><img src={Avatar} width={40} height={40} /></div>
          <div className='mr-auto'>
          <h3 className='text-sm sm:text-lg'>{previousMessage.receiver.fullName}</h3>
          <p className='text-sm'>Online</p>
          </div>
          <div>
          <IoCallOutline className='text-xl sm:text-3xl text-gray-500 mr-4 cursor-pointer' />
          </div>
          
        </div>
        }
   
    <div className={` w-full overflow-y-scroll no-scrollbar shadow-lg ${previousMessage?.message?.length>0?'h-[85%]':'h-[100%]'} `}>
      <div className='sm:px-14 px-4 sm:py-14 py-7'>
    
   
    {
    previousMessage?.messages?.length > 0?
    previousMessage.messages.map(({message,user:{id}={}})=>{
      if(id===user?.id){
        return(
          <>
   <div className='max-w-[80%] sm:max-w-[40%] rounded-b-xl rounded-tl-xl ml-auto bg-primary  mb-6 text-white p-4' >
          {message}
        </div>
        <div ref={messageRef}>

        </div>
          </>
         
        )
       
      }else{
        return (
          <>
            <div className='max-w-[80%] sm:max-w-[40%] rounded-b-xl rounded-tr-xl bg-secondary mb-6 p-4' >
      {message} 
    </div>
    <div ref={messageRef}>

</div>
          </>
        
        )
      }
      
    }):<div className='text-center text-xl mt-40 font-light'> Start Messaging</div>
  }
      </div>
    </div>
    {
      previousMessage?.receiver?.fullName && <div className='w-full flex items-center justify-center py-7 lg:p-14 mx-1'>
      <Innput type="text" placeholder='Enter a message' isClassName='w-[75%]' className='w-full p-2 px-4 border-0 shadow-lg bg-light focus:border-0 focus:outline-none' value={message} onChange={(e)=>setMessage(e.target.value)}/>
      <IoIosSend className={`text-3xl sm:text-4xl ml-2 sm:ml-4 mt-2 cursor-pointer bg-secondary rounded-full p-1 ${!message&& 'pointer-events-none'} `} onClick={()=>sendMessage()}/>
      <CiSquarePlus className={`text-4xl sm:text-5xl ml-2 sm:ml-4 mt-2 cursor-pointer bg-secondary rounded-full 
      p-1 ${!message&& 'pointer-events-none'}`}/>
    </div>
    }
    
    </>
        </div>
        <div className='w-1/4 h-screen'>
        <div>
          <h3 className='mx-4 my-10 text-primary'> People</h3>
          <div className='max-h-[60vh] w-full mb-4 overflow-y-scroll no-scrollbar'>{
            users.length>0?
            users.map(({user,userId},i)=>{
              return(
                <div key={i} className='' >
                  <div className='flex  items-center lg:justify-start mx-2 lg:m-4 my-4 border-b pb-2'>
                    <div className='flex items-center cursor-pointer' onClick={()=>fetchMessages('new',user)}>
                    <div className='border rounded-full p-1 hidden md:block'>
            <img src={Avatar} width={40} height={40} className='rounded-xl'/>
            </div>
          
            <div className='ml-4'>
              <h3  className='text-sm lg:text-2xl'>
                {user.fullName}
              </h3>
              <p className=' text-[10px] sm:text-sm font-light'>{user.email}</p>
              
            </div>
           
                    </div>
           
          </div>
                </div>
              )
            }):<div className='text-center text-lg font-semibold mt-10'>No Conversation</div>
            }
            </div>
        </div>

        </div>
    </div>
  )
}

export default DashBoard