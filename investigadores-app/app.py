from flask import Flask, request, render_template, redirect, url_for, session
from werkzeug.utils import secure_filename
import os
from db import guardar_en_bd
from extractors.lector_pdf_v4 import extraer_datos_pdf
import sqlite3

UPLOAD_FOLDER = 'Uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'clave_secreta_para_formularios'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/verificar', methods=['POST'])
def verificar():
    archivo = request.files.get('file')
    if archivo and allowed_file(archivo.filename):
        filename = secure_filename(archivo.filename)
        path_pdf = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        archivo.save(path_pdf)

        datos = extraer_datos_pdf(path_pdf)
        session['datos_extraidos'] = datos
        return render_template('editar_datos.html', datos=datos)
    else:
        return redirect(url_for('index'))

@app.route('/guardar', methods=['POST'])
def guardar():
    datos_editados = {
        "nombre_completo": request.form.get("nombre_completo"),
        "curp": request.form.get("curp"),
        "rfc": request.form.get("rfc"),
        "correo": request.form.get("correo"),
        "institucion": request.form.get("institucion"),
        "no_cvu": request.form.get("no_cvu"),
        "linea_investigacion": request.form.get("linea_investigacion")
    }

    resultado = guardar_en_bd(datos_editados)
    return redirect(url_for('registros'))

@app.route('/registros')
def registros():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT id, curp, nombre_completo, rfc, correo, institucion, no_cvu FROM investigadores")
    datos = c.fetchall()
    conn.close()
    return render_template('registros.html', datos=datos)

if __name__ == '__main__':
    app.run(debug=True)
