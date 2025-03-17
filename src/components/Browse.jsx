import React from 'react'
import Header from './Header'
import { APP_CONFIG } from '../utils/constants'

const Browse = () => {
    return (
        <div>
            <Header />
            <div className="pt-20 px-8">
                <h1 className="text-3xl text-white font-bold">
                    {APP_CONFIG.NAME} - {APP_CONFIG.DESCRIPTION}
                </h1>
                {/* Movie content will be added here */}
            </div>
        </div>
    )
}

export default Browse   