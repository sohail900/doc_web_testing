const Banner = ({ heroAboutData }) => {
    const repeatedText = Array(20).fill(heroAboutData.name)

    return (
        <section className='relative min-h-[500px] bg-blue-50/40 backdrop-blur-3xl overflow-hidden flex items-center justify-center mt-10'>
            {/* Background repeating text */}
            <div className='absolute inset-0 select-none'>
                <div className='flex flex-wrap gap-4 opacity-10 text-5xl sm:text-9xl font-semibold  p-8 flex-col text-center'>
                    {repeatedText.map((text, index) => (
                        <span key={index} className=' whitespace-nowrap'>
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            {/* Centered button */}
            {/* <button className='absolute bottom-10 font-medium mt-8 text-white w-fit rounded-full bg-primary py-3 px-5 flex items-center gap-2 group'>
                {t('makeAppointment')}
                <ArrowRight className='transition-all duration-500 ease-linear group-hover:translate-x-2' />
            </button> */}
        </section>
    )
}

export default Banner
