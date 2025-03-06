import React, { useEffect } from 'react'

const LoadingScreen = () => {
  useEffect(() => {
    // Disable scrolling when component mounts
    document.body.style.overflow = 'hidden'
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
  )
}

export default LoadingScreen