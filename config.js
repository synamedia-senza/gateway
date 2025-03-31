/*** gateway defaults ***/

export const devices = {
  device123: { name: 'Device 123', url: 'https://device123.example.com' },
  device456: { name: 'Device 456', url: 'https://device456.example.com' },
};

export const tenants = {
  tenant1: { name: 'Tenant One', url: 'https://tenant1.example.com' },
  tenant2: { name: 'Tenant Two', url: 'https://tenant2.example.com' },
};

export const defaultUrl = 'https://launcher.streaming.synamedia.com/redirect/senza-app/stable/index.html';


/*** ngrok defaults ***/

// Where the gateway is hosted. This should be the actual URL, not a redirect.
// This is the hosted shared instance that you are welcome to use.
export const gatewayApi = 'https://gateway-455317.ue.r.appspot.com';

// The port where you are serving your app on your computer
export const tunnelPort = 80;

// Updated these with info about your device so you don't have to include them
// on the command line every time when running the script.
export const defaultDevice = {
  id: 'device123',
  name: 'Device 123',
  urlPath: '/'
}

