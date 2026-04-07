import Link from "next/link";

export default function Home() {

  return (

    <div>

      {/* HEADER */}

      <div className="header">

        <h1>CIWAG VTU</h1>

        <p>
          Fast, Secure and Affordable Airtime, Data, Electricity and Cable
          Subscription Services
        </p>

      </div>


      {/* SERVICES */}

      <div className="container">

        <h2 className="section-title">Our Services</h2>

        <div className="grid">

          {/* AIRTIME */}

          <Link href="/dashboard/buy-airtime" className="card">

            <h3>📞 Airtime</h3>

            <p>
              Instantly recharge airtime for MTN, Airtel, Glo and 9mobile.
            </p>

          </Link>


          {/* DATA */}

          <Link href="/dashboard/buy-data" className="card">

            <h3>📶 Data</h3>

            <p>
              Buy affordable internet data bundles for all networks.
            </p>

          </Link>


          {/* ELECTRICITY */}

          <Link href="/dashboard/electricity" className="card">

            <h3>⚡ Electricity</h3>

            <p>
              Pay electricity bills for all Nigerian distribution companies.
            </p>

          </Link>


          {/* CABLE */}

          <Link href="/dashboard/cable" className="card">

            <h3>📺 Cable TV</h3>

            <p>
              Subscribe to DSTV, GOTV and Startimes easily.
            </p>

          </Link>

        </div>

      </div>

    </div>

  )

}