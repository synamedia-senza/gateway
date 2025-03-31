import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { tenants as defaultTenants, devices as defaultDevices, defaultUrl } from './config.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.use(bodyParser.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

let tenants = { ...defaultTenants };
let devices = { ...defaultDevices };

// REST API: Redirect URL logic
app.get('/api/redirect', (req, res) => {
  const { deviceId, tenantId } = req.query;

  if (!deviceId || !tenantId) {
    return res.status(400).json({ error: 'deviceId and tenantId are required' });
  }

  if (devices[deviceId]) {
    return res.json({ url: devices[deviceId].url });
  }
  
  if (tenants[tenantId]) {
    return res.json({ url: tenants[tenantId].url });
  }

  return res.json({ url: defaultUrl });
});

// List, add, delete APIs for tenants and devices (same as before)
app.get('/api/tenants', (req, res) => res.json(tenants));
app.get('/api/devices', (req, res) => res.json(devices));

app.post('/api/tenants', (req, res) => {
  const { tenantId, name, url } = req.body;
  if (!tenantId || !url || !name) {
    return res.status(400).json({ error: 'tenantId, name, and url are required' });
  }

  tenants[tenantId] = { name, url };
  res.status(201).json({ message: 'Tenant added/updated' });
});

app.post('/api/devices', (req, res) => {
  const { deviceId, name, url } = req.body;
  if (!deviceId || !url || !name) {
    return res.status(400).json({ error: 'deviceId, name, and url are required' });
  }

  devices[deviceId] = { name, url };
  res.status(201).json({ message: 'Device added/updated' });
});

app.delete('/api/tenants/:tenantId', (req, res) => {
  const { tenantId } = req.params;
  if (tenants[tenantId]) {
    delete tenants[tenantId];
    res.json({ message: 'Tenant deleted' });
  } else {
    res.status(404).json({ error: 'Tenant not found' });
  }
});

app.delete('/api/devices/:deviceId', (req, res) => {
  const { deviceId } = req.params;
  if (devices[deviceId]) {
    delete devices[deviceId];
    res.json({ message: 'Device deleted' });
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

app.listen(port, () => {
  console.log(`Gateway service running at http://localhost:${port}`);
});
