import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-purple-700 via-purple-900 to-black text-white p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-black/30 backdrop-blur rounded-lg p-6 border border-white/10">
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {sent ? <p className="text-sm text-purple-200">Reset link sent if the email exists.</p> : null}
        <Button className="w-full">Send reset link</Button>
        <div className="flex justify-between text-sm">
          <Link to="/login" className="underline">Back to login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;

