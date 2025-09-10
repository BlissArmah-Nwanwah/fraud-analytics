import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/api/authApi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { GhanaRegion } from "@/types/regions";
import type { RootState } from "@/app/rootReducer";
import {
  setField,
  setStep as setStepAction,
  resetSignup,
} from "@/app/slices/signupSlice";

const GHANA_REGIONS = Object.values(GhanaRegion);
import { validateSignupStep } from "@/validators/signup";

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const signup = useSelector((s: RootState) => s.signup);
  const [firstName, setFirstName] = useState(signup.firstName);
  const [lastName, setLastName] = useState(signup.lastName);
  const [email, setEmail] = useState(signup.email);
  const [password, setPassword] = useState(signup.password);
  const [location, setLocation] = useState(signup.location);
  const [username, setUsername] = useState(signup.username || "");
  const [step, setStep] = useState(signup.step);
  const [localError, setLocalError] = useState<string | null>(null);
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const validateStep = useCallback(
    (s: number): string | null =>
      validateSignupStep(s, { firstName, lastName, email, password, location }),
    [firstName, lastName, email, password, location]
  );

  const onSubmit = useCallback(async () => {
    if (step < 3) return;
    const err = validateStep(3);
    if (err) {
      setLocalError(err);
      return;
    }
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        location,
        username: username.trim() ?? undefined,
      }).unwrap();
      dispatch(resetSignup());
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  }, [
    step,
    validateStep,
    register,
    firstName,
    lastName,
    email,
    password,
    location,
    username,
    dispatch,
    navigate,
  ]);

  const next = useCallback(() => {
    if (isLoading) return;
    const err = validateStep(step);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError(null);
    setStep((p) => {
      const n = Math.min(3, p + 1);
      dispatch(setStepAction(n));
      return n;
    });
  }, [dispatch, isLoading, step, validateStep]);

  const back = useCallback(() => {
    setLocalError(null);
    setStep((p) => {
      const n = Math.max(1, p - 1);
      dispatch(setStepAction(n));
      return n;
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(setField({ key: "firstName", value: firstName }));
    dispatch(setField({ key: "lastName", value: lastName }));
    dispatch(setField({ key: "email", value: email }));
    dispatch(setField({ key: "username", value: username }));
    dispatch(setField({ key: "password", value: password }));
    dispatch(setField({ key: "location", value: location }));
  }, [dispatch, firstName, lastName, email, username, password, location]);

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-purple-700 via-purple-900 to-black text-white p-4">
      <form className="w-full max-w-sm space-y-4 bg-black/30 backdrop-blur rounded-lg p-6 border border-white/10">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <div className="text-sm text-white/70">Step {step} of 3</div>

        {step === 1 ? (
          <>
            <Input
              placeholder="First name"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Last name"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full"
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Input
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Input
              placeholder="Username (optional)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
            <Select value={location ?? undefined} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Ghana Regions</SelectLabel>
                  {GHANA_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        ) : null}

        {localError ? (
          <p className="text-red-300 text-sm">{localError}</p>
        ) : null}
        {error ? (
          <p className="text-red-300 text-sm">Failed to signup</p>
        ) : null}

        <div className="flex gap-2">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={back}
              disabled={isLoading}
            >
              Back
            </Button>
          ) : null}
          {step < 3 ? (
            <Button
              type="button"
              onClick={next}
              className={step === 1 ? "w-full text-white" : "ml-auto text-white"}
              disabled={isLoading}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isLoading || !location}
              className="ml-auto text-white"
            >
              Create account
            </Button>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <Link to="/login" className="underline">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
