import { twMerge } from 'tailwind-merge'
const Button = ({ children, className, ...props }) => {
    return (
        <button
            className={twMerge(
                'w-full h-10 bg-primary text-white  rounded-lg transition-all duration-100 ease-in-out hover:bg-primary/70 ',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
