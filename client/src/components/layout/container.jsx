import React from 'react'

const Container = ({ children, className = '' }) => {
return (
    <div className={`
            w-full 
            mx-auto 
            px-2 sm:px-4 lg:px-6
            max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-[90rem]
            ${className}
        `.trim()} >{children}</div>
)
}

export default Container