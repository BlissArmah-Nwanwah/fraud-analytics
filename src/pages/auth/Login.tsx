import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api/authApi";
import { useToast } from "@/components/ui/toast";
import { isEmail, isStrongPassword } from "@/validators/signup";
import { resolveFriendlyError } from "@/constants/errors";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const { show } = useToast();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = isEmail(email);
    const passwordValidation = isStrongPassword(password);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    if (emailValidation || passwordValidation) return;
    try {
      await login({ email, password }).unwrap();
      show({ title: "Welcome back", description: "Logged in successfully" });
      navigate("/");
    } catch (err) {
      const friendly = resolveFriendlyError(err);
      setSubmitError(friendly);
      show({ title: "Login failed", description: friendly });
    }
  };

  const onEmailChange = (v: string) => {
    setEmail(v);
    setEmailError(isEmail(v));
    if (submitError) setSubmitError(null);
  };

  const onPasswordChange = (v: string) => {
    setPassword(v);
    setPasswordError(isStrongPassword(v));
    if (submitError) setSubmitError(null);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-purple-700 via-purple-900 to-black text-white p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 bg-black/30 backdrop-blur rounded-lg p-6 border border-white/10"
      >
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          aria-invalid={!!emailError}
          className="w-full"
        />
        {emailError ? (
          <p className="text-red-300 text-sm">{emailError}</p>
        ) : null}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          aria-invalid={!!passwordError}
          className="w-full"
        />
        {passwordError ? (
          <p className="text-red-300 text-sm">{passwordError}</p>
        ) : null}
        {submitError ? (
          <p className="text-red-300 text-sm">{submitError}</p>
        ) : null}
        <Button
          disabled={
            isLoading || !!emailError || !!passwordError || !email || !password
          }
          className="w-full text-white"
        >
          Login
        </Button>
        <div className="flex justify-between text-sm">
          <Link to="/signup" className="underline">
            Create account
          </Link>
          <Link to="/forgot-password" className="underline">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
