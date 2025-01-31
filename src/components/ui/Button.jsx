import React from 'react'

const Button = ({ children, className, ...props }) => {
    return (
        <button
            className={`w-full h-10 bg-primary text-white  rounded-lg transition-all duration-100 ease-in-out hover:bg-primary/70 ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
