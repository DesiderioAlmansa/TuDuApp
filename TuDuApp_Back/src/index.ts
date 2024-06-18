import server from './server'
import color from 'colors'

const port = process.env.Port || 5500

server.listen(port, () => {
    console.log(color.green.bold(`REST API running on port ${port}`));
  }).on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(color.red.bold(`Port ${port} is already in use. Please choose a different port.`));
    } else {
      console.error(color.red.bold(`Failed to start server: ${err.message}`));
    }
  });