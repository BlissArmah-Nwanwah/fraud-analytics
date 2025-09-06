import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api/authApi";
import { useToast } from "@/components/ui/toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const { show } = useToast();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      show({ title: "Welcome back", description: "Logged in successfully" });
      navigate("/");
    } catch {}
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-purple-700 via-purple-900 to-black text-white p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-black/30 backdrop-blur rounded-lg p-6 border border-white/10">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-red-300 text-sm">Failed to login</p> : null}
        <Button disabled={isLoading} className="w-full">Login</Button>
        <div className="flex justify-between text-sm">
          <Link to="/signup" className="underline">Create account</Link>
          <Link to="/forgot-password" className="underline">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
