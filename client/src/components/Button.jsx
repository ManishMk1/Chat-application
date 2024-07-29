import React from 'react'

function Button({
    label='Button',
    type='button',
    className='',
    disabled=false

}) {
  return (
   <button className={`text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-[100px] sm:w-auto px-5 py-2.5 text-center ${className}`} disabled={disabled}>
    {label}
   </button>
  )
}

export default Button