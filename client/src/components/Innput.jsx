import React from 'react'

function Input({
  label="",
  name="",
  type="text",
  isClassName="",
  className="",
  isRequired=false,
  placeholder='',
  value='',
  onChange
}) {
  

  return (
    <div className={`${isClassName}`}>
        <label htmlFor="first_name" className='block mb-2 text-sm font-medium'>{label}</label>
        <input type={type} id={name} className={`bg-gray-50 block border border-gray-300 
           text-gray-900 text-sm rounded-lg w-full p-2.5 ${className}`}placeholder={placeholder} required={isRequired} value={value} onChange={onChange} />

    </div>
  )
}

export default Input