import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signup({
        username,
        email,
        password,
        firstName,
        lastName,
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Create an Account
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-900/50 text-red-400 text-sm p-3 rounded-md border border-red-800">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
            <p className="text-sm text-center text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
