export const dynamic = "force-dynamic";

async function getTransactions() {
  const res = await fetch(
 `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/transactions`,
  );

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data ?? [];
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div>
      <h1>Transactions</h1>
      <pre>{JSON.stringify(transactions, null, 2)}</pre>
    </div>
  );
}