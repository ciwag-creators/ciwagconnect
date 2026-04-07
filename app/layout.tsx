import "./globals.css"
import Link from "next/link"

export const metadata = {
  title: "CIWAG CONNECT",
  description: "Buy Airtime, Data, Electricity and Cable TV easily",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="logo">
            CIWAG VTU
          </Link>

          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/dashboard/buy-airtime">Airtime</Link>
            <Link href="/dashboard/buy-data">Data</Link>
            <Link href="/dashboard/electricity">Electricity</Link>
            <Link href="/dashboard/cable">Cable TV</Link>
            <Link href="/become-agent">Become Agent</Link>
          </div>
        </nav>

        <main className="main-container">{children}</main>
      </body>
    </html>
  )
}