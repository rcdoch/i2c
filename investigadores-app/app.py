from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
import os

from db import guardar_en_bd
from extractors.lector_pdf_v5 import extraer_datos_pdf

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def index():
    mensaje = ""
    if request.method == 'POST':
        if 'file' not in request.files:
            mensaje = "❌ No se envió ningún archivo."
        else:
            archivos = request.files.getlist('file')
            mensajes = []

            for file in archivos:
                if file.filename == '':
                    mensajes.append("⚠️ Uno de los archivos no tiene nombre.")
                    continue
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    path_pdf = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(path_pdf)

                    # Extraer datos del PDF
                    datos = extraer_datos_pdf(path_pdf)

                    # Guardar en la base de datos
                    resultado = guardar_en_bd(datos)
                    mensajes.append(f"✅ {filename} → {resultado}")
                else:
                    mensajes.append(f"⚠️ {file.filename} → Archivo no válido.")

            mensaje = "<br>".join(mensajes)

    return render_template('index.html', mensaje=mensaje)

@app.route('/registros')
def registros():
    import sqlite3
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("""
        SELECT id, curp, nombre_completo, rfc, correo, institucion, no_cvu, fecha_nacimiento, puesto, telefono
        FROM investigadores
    """)  # Incluir puesto y teléfono
    datos = c.fetchall()
    conn.close()
    return render_template('registros.html', datos=datos)

if __name__ == '__main__':
    app.run(debug=True)
