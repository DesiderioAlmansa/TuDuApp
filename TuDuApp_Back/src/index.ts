import server from './server'
import colors from 'colors'

const port = process.env.Port || 5500

server.listen(port, () => {
    console.log(colors.green.bold(`REST API running on port ${port}`));
  }).on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(colors.red.bold(`Port ${port} is already in use. Please choose a different port.`));
    } else {
      console.error(colors.red.bold(`Failed to start server: ${err.message}`));
    }
  });