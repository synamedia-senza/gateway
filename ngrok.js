import fetch from 'node-fetch';
import punycode from 'punycode/punycode.js';
import { gatewayApi, tunnelPort, defaultDevice } from './config.js';

const ngrokLocalApi = "http://localhost:4040/api/tunnels";
const tunnelName = "command_line";

let device = { ...defaultDevice };
const args = process.argv.slice(2);
if (args.length > 0) device.id = args[0];
if (args.length > 1) device.name = args[1];
if (args.length > 2) device.urlPath = args[2];

async function getTunnels() {
  try {
    const response = await fetch(ngrokLocalApi, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();
    return data.tunnels;
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

async function stopTunnel(name) {
  try {
    const response = await fetch(ngrokLocalApi + '/' + name, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

async function startTunnel(port) {
  try {
    const response = await fetch(ngrokLocalApi, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({addr: port, proto: "http", name: tunnelName})
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();
    return data;
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

async function updateDevice(tunnelUrl, localUrl) {
  let url = tunnelUrl + device.urlPath;
  const response = await fetch(gatewayApi + '/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId: device.id, name: device.name, url })
  });
  
  if (response.ok) {
    console.log(`${device.name} (${device.id}): ${url} => ${localUrl}${device.urlPath}`);
  } else {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}

// reconnects to ngrok to get a new URL, which makes sure that
// the browser does not show a cached version of the app
await stopTunnel(tunnelName);
await startTunnel(tunnelPort);

let tunnels = await getTunnels();
if (tunnels.length) {
  await updateDevice(tunnels[0].public_url, tunnels[0].config.addr);
}
