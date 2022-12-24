import React from 'react'

const LoadingScreen = ({setIsLoading}) => {
    return (
        <div className='checkout'>
            <div className='maincheckout'>
                <button disabled className='btn-close' onClick={() => setIsLoading(false)}>x</button>
                <div className='heading mt-5'>
                    <p className="w-100 text-center">Waiting for Transaction...</p>
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen