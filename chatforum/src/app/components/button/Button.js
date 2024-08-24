import React from 'react'

export default function Button({title, handleRemove}) {
  return (
    <div>
      <button className=' bg-purple-700 rounded-md text-white px-5 py-2 hover:bg-purple-600 transition-all ease-in' onClick={handleRemove?handleRemove:""}>{title}</button>
    </div>
  )
}
