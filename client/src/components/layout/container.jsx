import React from 'react'

const Container = ({ children, className = '' }) => {
return (
    <div className={`
            w-full 
            mx-auto 
            sm:px-2 lg:px-4
            max-w-sm sm:max-w-md md:max-w-xl lg:max-w-[1024px] xl:max-w-[1280px] 2xl:max-w-[1440px]
            ${className}
        `.trim()} >{children}</div>
)
}

export default Container