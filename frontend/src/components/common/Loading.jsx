import React from 'react'

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-10">
      <div className="loading-spinner mb-4"></div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  )
}

export default Loading