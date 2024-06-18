import server from './server'

const port = process.env.Port || 4000

server.listen(port, () => {
    console.log(`REST API running on port ${port}`)
})