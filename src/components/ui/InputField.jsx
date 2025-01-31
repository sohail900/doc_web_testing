import React from 'react'

const InputField = ({ title, ...props }) => {
    return (
        <>
            <label htmlFor={props.id} className='text-primary/80 font-medium'>
                {title}
            </label>
            <input
                className='mt-1 mb-3 py-3 px-3 w-full rounded-lg border-none bg-black/5 text-black focus-within:outline-primary/30'
                {...props}
            />
        </>
    )
}

export default InputField
