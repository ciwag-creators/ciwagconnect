"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {

  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({

      email,
      password,

    });

    setLoading(false);

    if (error) {

      alert(error.message);

      return;

    }

    alert("Login successful");

    router.push("/dashboard");

  }

  return (

    <div style={container}>

      <form onSubmit={handleLogin} style={form}>

        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button type="submit" style={button}>

          {loading ? "Logging in..." : "Login"}

        </button>

      </form>

    </div>

  );

}

const container = {

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",

};

const form = {

  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
  width: "300px",

};

const input = {

  padding: "10px",

};

const button = {

  padding: "10px",
  backgroundColor: "green",
  color: "white",
  border: "none",

};