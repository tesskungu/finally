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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, LogIn } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: forgotPasswordEmail,
      });
      setForgotPasswordSent(true);
      toast.success("Password reset link sent to your email");
    } catch (err) {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <header className="mb-8">
        <h1
          className="text-2xl font-bold text-white cursor-pointer hover:text-orange-500"
          onClick={() => navigate("/")}
        >
          Fabric Studio
        </h1>
      </header>
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-900/50 text-red-400 text-sm p-3 rounded-md border border-red-800">
                {error}
              </div>
            )}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="text-sm text-orange-500 hover:text-orange-400"
              >
                Forgot Password?
              </button>
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
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
            <p className="text-sm text-center text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordMode}
        onOpenChange={(open) => {
          setForgotPasswordMode(open);
          if (!open) {
            setForgotPasswordSent(false);
            setForgotPasswordEmail("");
          }
        }}
      >
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          {forgotPasswordSent ? (
            <div className="py-4 text-center">
              <div className="text-green-400 mb-2">✓</div>
              <p className="text-gray-300">
                Password reset link has been sent to your email. Please check
                your inbox.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="name@example.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setForgotPasswordMode(false)}
                  variant="outline"
                  className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? "Sending..." : "Send Link"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
