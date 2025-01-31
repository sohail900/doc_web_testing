import React from 'react'

const BackdropLayout = () => {
    return (
        <div className='fixed inset-0 w-full h-full overflow-hidden -z-10'>
            {/* Base gradient background */}

            {/* Blur container */}
            <div className='relative w-full h-full'>
                {/* Top-right circle */}
                <div className='absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full bg-color1 blur-[150px]' />

                {/* Bottom-left circle */}
                <div className='absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full bg-color1 blur-[150px]' />

                {/* Small top circle */}
                <div className='absolute top-[50px] left-[100px] w-[200px] h-[200px] rounded-full bg-color1 blur-[120px]' />

                {/* Additional decorative elements */}
                <div className='absolute  -bottom-20 left-10 w-[300px] h-[300px] rounded-full bg-color1 blur-[120px]' />

                <div className='absolute bottom-[-300px] right-0 w-[600px] h-[600px] rounded-full bg-color1 blur-[200px]' />
            </div>

            {/* Content container - this will contain your page content */}
        </div>
    )
}

export default BackdropLayout
