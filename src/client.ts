import net from 'net';

const client = net.connect({ port: 60300 });

if (process.argv.length < 3) {
  throw new Error('Please, provide a command.');
} else {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  const data = JSON.stringify({ command, args });

  client.write(data);
  client.end();
}

let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

client.on('end', () => {
  console.log('Received from server:\n', wholeData.toString());
});

client.on('close', () => {
  console.log('Connection closed');
});
