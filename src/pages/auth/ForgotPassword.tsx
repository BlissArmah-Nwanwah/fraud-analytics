import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "@/api/authApi";
import { isEmail } from "@/validators/signup";
import { resolveFriendlyError } from "@/constants/errors";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = isEmail(email);
    setEmailError(emailValidation);
    if (emailValidation) return;
    try {
      await forgotPassword({ email }).unwrap();
      setSent(true);
      setSubmitError(null);
    } catch (err) {
      setSubmitError(resolveFriendlyError(err));
    }
  };

  const onEmailChange = (v: string) => {
    setEmail(v);
    setEmailError(isEmail(v));
    if (submitError) setSubmitError(null);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-purple-700 via-purple-900 to-black text-white p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 bg-black/30 backdrop-blur rounded-lg p-6 border border-white/10"
      >
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          aria-invalid={!!emailError}
        />
        {emailError ? (
          <p className="text-red-300 text-sm">{emailError}</p>
        ) : null}
        {submitError ? (
          <p className="text-red-300 text-sm">{submitError}</p>
        ) : null}
        {sent ? (
          <p className="text-sm text-purple-200">
            A reset code was sent to your email.
          </p>
        ) : null}
        <Button
          disabled={isLoading || !!emailError || !email}
          className="w-full"
        >
          Send reset code
        </Button>
        <div className="flex justify-between text-sm">
          <Link to="/login" className="underline">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
