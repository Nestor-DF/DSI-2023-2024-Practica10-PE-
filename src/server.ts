import net from 'net';
import { spawn } from 'child_process';

const server = net.createServer({ allowHalfOpen: true }, (connection) => {
  console.log('A client has connected.');

  let wholeData = '';
  connection.on('data', (dataChunk) => {
    wholeData += dataChunk;
  });

  connection.on('end', () => {
    const { command, args } = JSON.parse(wholeData.toString());

    const process = spawn(command, args);

    process.stdout.on('data', (output) => {
      connection.write(output);
    });

    process.stderr.on('data', (error) => {
      connection.write(error);
    });

    process.on('error', (error) => {
      connection.write(error.message);
    });

    process.on('close', () => {
      console.log('Command execution finished.');
      connection.end();
    });
  });

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
});

server.listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
