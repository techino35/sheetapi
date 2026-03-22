/**
 * SheetAPI - JavaScript Usage Examples
 */

const BASE_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
const API_KEY = 'sk_your_api_key_here';

async function getAllRows(sheet) {
  const res = await fetch(`${BASE_URL}?key=${API_KEY}&action=read&sheet=${sheet}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

async function filterRows(sheet, filters = {}) {
  const params = new URLSearchParams({ key: API_KEY, action: 'read', sheet, ...filters });
  const res = await fetch(`${BASE_URL}?${params}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

async function createRow(sheet, data) {
  const res = await fetch(`${BASE_URL}?key=${API_KEY}&action=create&sheet=${sheet}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json;
}

async function updateRow(sheet, row, data) {
  const res = await fetch(`${BASE_URL}?key=${API_KEY}&action=update&sheet=${sheet}&row=${row}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  });
  return (await res.json());
}

async function deleteRow(sheet, row) {
  const res = await fetch(`${BASE_URL}?key=${API_KEY}&action=delete&sheet=${sheet}&row=${row}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})
  });
  return (await res.json());
}
