const addressInput = document.getElementById('addressInput');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const refreshBtn = document.getElementById('refreshBtn');
const goBtn = document.getElementById('goBtn');
const menuBtn = document.getElementById('menuBtn');
const extensionsBtn = document.getElementById('extensionsBtn');
const extensionsDialog = document.getElementById('extensionsDialog');
const closeExtensions = document.getElementById('closeExtensions');
const extensionPath = document.getElementById('extensionPath');
const extensionList = document.getElementById('extensionList');

async function loadExtensionsData() {
  const path = await window.sBrowser.extensionPath();
  extensionPath.textContent = path;

  const extensions = await window.sBrowser.listExtensions();
  extensionList.innerHTML = '';

  if (!extensions.length) {
    extensionList.innerHTML = '<p>No extensions loaded yet.</p>';
    return;
  }

  extensions.forEach((ext) => {
    const item = document.createElement('div');
    item.className = 'extension-item';
    item.innerHTML = `<strong>${ext.name}</strong><div>Version ${ext.version}</div><div>ID: ${ext.id}</div>`;
    extensionList.appendChild(item);
  });
}

function submitAddress() {
  window.sBrowser.navigate(addressInput.value);
}

goBtn.addEventListener('click', submitAddress);
addressInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    submitAddress();
  }
});

backBtn.addEventListener('click', () => window.sBrowser.goBack());
forwardBtn.addEventListener('click', () => window.sBrowser.goForward());
refreshBtn.addEventListener('click', () => window.sBrowser.refreshPage());

menuBtn.addEventListener('click', () => {
  window.sBrowser.openExternal('https://www.samsung.com/global/galaxy/apps/samsung-internet/');
});

extensionsBtn.addEventListener('click', async () => {
  await loadExtensionsData();
  extensionsDialog.showModal();
});

closeExtensions.addEventListener('click', () => extensionsDialog.close());

window.sBrowser.onNavigationState((state) => {
  if (state.url) {
    addressInput.value = state.url;
  }

  backBtn.disabled = !state.canGoBack;
  forwardBtn.disabled = !state.canGoForward;
  refreshBtn.textContent = state.isLoading ? '⏹' : '↻';
  document.title = state.title ? `${state.title} · S Browser` : 'S Browser';
});
