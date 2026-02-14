import "./dashboard.css";

export default function Dashboard() {

  const balance = 12500;

  const transactions = [

    {
      id: "TX123",
      amount: 1000,
      date: "Today"
    },

    {
      id: "TX124",
      amount: 2000,
      date: "Yesterday"
    }

  ];

  return (

    <div className="dashboard-container">


      {/* HEADER */}

      <div className="dashboard-header">

        <h2>Welcome, User</h2>

        <p>Manage your VTU services</p>

      </div>


      {/* WALLET */}

      <div className="wallet-card">

        <p>Wallet Balance</p>

        <div className="wallet-balance">

          ₦{balance.toLocaleString()}

        </div>

      </div>


      {/* ACTIONS */}

      <div className="actions">


        <div className="action-card">

          Buy Airtime

        </div>


        <div className="action-card">

          Buy Data

        </div>


        <div className="action-card">

          Buy Electricity

        </div>


        <div className="action-card">

          Fund Wallet

        </div>


      </div>


      {/* TRANSACTIONS */}

      <div className="transaction-section">

        <h3>Recent Transactions</h3>


        {transactions.map(tx => (

          <div key={tx.id} className="transaction-card">

            ₦{tx.amount} — {tx.date}

          </div>

        ))}


      </div>


    </div>

  );

}
