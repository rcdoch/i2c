import sqlite3

def guardar_en_bd(datos):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    curp = datos.get("curp", "").strip()
    nombre = datos.get("nombre_completo", "").strip()

    # CASO 1: Sin CURP - verificamos por nombre
    if curp == "" or curp.upper() == "NO DETECTADO":
        c.execute('SELECT * FROM investigadores WHERE nombre_completo = ?', (nombre,))
        existente = c.fetchone()

        if existente:
            conn.close()
            return f"⚠️ CURP no detectado, pero el nombre coincide con otro registro.\n🧠 Revisa si es duplicado o edita manualmente."
        else:
            try:
                campos = list(datos.keys())
                valores = [datos[c] for c in campos]
                c.execute(f'''
                    INSERT INTO investigadores ({", ".join(campos)})
                    VALUES ({", ".join(["?"] * len(campos))})
                ''', tuple(valores))
                conn.commit()
                conn.close()
                return f"⚠️ Registro agregado SIN CURP detectado. Favor de revisar y editar luego."
            except Exception as e:
                conn.close()
                return f"❌ Error al guardar sin CURP: {e}"

    # CASO 2: CURP válido - revisamos duplicado
    c.execute('SELECT * FROM investigadores WHERE curp = ?', (curp,))
    if c.fetchone():
        conn.close()
        return f"❌ El CURP {curp} ya está registrado."

    # CASO 3: CURP válido y nuevo
    try:
        campos = list(datos.keys())
        valores = [datos[c] for c in campos]
        c.execute(f'''
            INSERT INTO investigadores ({", ".join(campos)})
            VALUES ({", ".join(["?"] * len(campos))})
        ''', tuple(valores))
        conn.commit()
        conn.close()
        return f"✅ Registro exitoso para CURP {curp}"
    except Exception as e:
        conn.close()
        return f"❌ Error al guardar CURP {curp}: {e}"

