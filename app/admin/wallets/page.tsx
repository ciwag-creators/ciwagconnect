export const dynamic = "force-dynamic";

async function getWallets() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/wallets`
  );

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data ?? [];
}

export default async function WalletsPage() {
  const wallets = await getWallets();

  return (
    <div>
      <h1>Wallets</h1>
      <pre>{JSON.stringify(wallets, null, 2)}</pre>
    </div>
  );
}