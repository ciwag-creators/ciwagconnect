import Link from "next/link";

export default function Home() {
  return (

    <div>

      <div className="header">
        <h1>CIWAG VTU Platform</h1>
        <p>Buy Airtime, Data and Electricity</p>
      </div>

      <div className="container">

        <div className="grid">

          <div className="card center">

            <h2 className="title">Dashboard</h2>

            <Link href="/dashboard">

              <button className="button">
                Enter Dashboard
              </button>

            </Link>

          </div>


          <div className="card center">

            <h2 className="title">Admin</h2>

            <Link href="/admin">

              <button className="button">
                Admin Panel
              </button>

            </Link>

          </div>

        </div>

      </div>

    </div>

  );
}
