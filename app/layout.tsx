export const metadata = {
  title: "CIWAG VTU Platform",
  description: "Buy Airtime, Data, Electricity",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}