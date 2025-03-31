async function fetchAndRender(endpoint, tableId, deleteFn) {
  const res = await fetch(endpoint);
  const data = await res.json();
  const tableBody = document.querySelector(`#${tableId} tbody`);
  tableBody.innerHTML = '';
  for (const id in data) {
    const { name, url } = data[id];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${id}</td>
      <td>${name}</td>
      <td>${url}</td>
      <td>
        <button class="delete-button" onclick="${deleteFn}('${id}')">Delete</button>
      </td>`;
    tableBody.appendChild(row);
  }
}

async function deleteTenant(id) {
  await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
  loadAll();
}

async function deleteDevice(id) {
  await fetch(`/api/devices/${id}`, { method: 'DELETE' });
  loadAll();
}

document.getElementById('tenant-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const tenantId = document.getElementById('tenantId').value;
  const tenantName = document.getElementById('tenantName').value;
  const tenantUrl = document.getElementById('tenantUrl').value;

  await fetch('/api/tenants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId, name: tenantName, url: tenantUrl })
  });

  e.target.reset();
  loadAll();
});

document.getElementById('device-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const deviceId = document.getElementById('deviceId').value;
  const deviceName = document.getElementById('deviceName').value;
  const deviceUrl = document.getElementById('deviceUrl').value;

  await fetch('/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, name: deviceName, url: deviceUrl })
  });

  e.target.reset();
  loadAll();
});

function loadAll() {
  fetchAndRender('/api/tenants', 'tenant-table', 'deleteTenant');
  fetchAndRender('/api/devices', 'device-table', 'deleteDevice');
}

// Initial load
loadAll();
