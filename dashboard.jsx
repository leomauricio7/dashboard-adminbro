import React, { useState, useEffect } from 'react'
import { ApiClient } from 'admin-bro'
import { Box } from '@admin-bro/design-system'

const api = new ApiClient()

const Dashboard = () => {
    const [data, setData] = useState({})

    useEffect(() => {
        api.getDashboard().then((response) => {
            setData(response.data)
        })
    }, [])

    return (
        <Box variant="grey">
            <Box variant="white">
                some: {data.user}
                <h1>Meu Dashboard Customizado</h1>
            </Box>
        </Box>
    )
}

export default Dashboard