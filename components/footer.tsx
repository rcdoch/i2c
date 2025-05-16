import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-blue-100 py-8 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <h4 className="font-semibold mb-4 text-blue-900">Términos Legales</h4>
          <ul className="flex flex-wrap gap-6 justify-center mb-6">
            <li>
              <Link href="/terminos" className="text-blue-600 hover:text-blue-900 transition-colors">
                Términos de servicio
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="text-blue-600 hover:text-blue-900 transition-colors">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="text-blue-600 hover:text-blue-900 transition-colors">
                Política de cookies
              </Link>
            </li>
          </ul>
          <div className="text-center text-blue-600">
            <p>
              © {new Date().getFullYear()} SECCTI - Sistema Estatal de Ciencia, Tecnología e Innovación de Chihuahua.
              Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
