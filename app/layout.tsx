import "./globals.css"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <html lang="en">
      <body>

        {/* NAVBAR */}

        <nav className="navbar">

          {/* LOGO */}
          <Link href="/" className="logo">
            CIWAG VTU
          </Link>

          {/* MENU */}

          <div className="nav-links">

            <Link href="/">Home</Link>

            <Link href="/dashboard">
              Dashboard
            </Link>

            <Link href="/dashboard/buy-airtime">
              Airtime
            </Link>

            <Link href="/dashboard/buy-data">
              Data
            </Link>

            <Link href="/dashboard/electricity">
              Electricity
            </Link>

            <Link href="/dashboard/cable">
              Cable TV
            </Link>

            <Link href="/become-agent">
              Become Agent
            </Link>

          </div>

        </nav>

        {/* PAGE CONTENT */}

        {children}

      </body>
    </html>

  )
}