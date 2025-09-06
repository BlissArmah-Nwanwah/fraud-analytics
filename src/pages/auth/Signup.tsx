import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "@/api/authApi";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { isLoading, error }] = useSignupMutation();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ name, email, password }).unwrap();
      navigate("/");
    } catch {}
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-purple-700 via-purple-900 to-black text-white p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-black/30 backdrop-blur rounded-lg p-6 border border-white/10">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-red-300 text-sm">Failed to signup</p> : null}
        <Button disabled={isLoading} className="w-full">Create account</Button>
        <div className="flex justify-between text-sm">
          <Link to="/login" className="underline">Back to login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;

