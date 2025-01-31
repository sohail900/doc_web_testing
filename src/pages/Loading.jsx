import React from 'react'

const Loading = () => {
    return (
        <div className='w-full h-screen grid place-items-center z-50'>
            <div className='size-20 border-l-2 border-r-0 border-t-2 border-b-0 border-primary animate-spin rounded-full' />
        </div>
    )
}

export default Loading
