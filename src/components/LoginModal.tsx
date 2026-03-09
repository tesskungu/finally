import { useState } from "react";
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
import { Loader2, LogIn, UserPlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup({
          username,
          email,
          password,
          firstName,
          lastName,
        });
      }
      onSuccess?.();
      onClose();
      resetForm();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setConfirmPassword("");
    setError("");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotPasswordEmail }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setForgotPasswordSuccess(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again.";
      setError(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-md mx-4 bg-gray-900 border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-gray-400 hover:text-orange-500 hover:bg-transparent"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">
            {mode === "login" ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {mode === "login"
              ? "Sign in to save your designs"
              : "Sign up to save your designs"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-900/50 text-red-400 text-sm p-3 rounded-md border border-red-800">
                {error}
              </div>
            )}
            {mode === "signup" && (
              <>
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
                    required={mode === "signup"}
                    disabled={loading}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </>
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
            </div>
            {mode === "login" && (
              <div className="flex justify-start">
                <button
                  type="button"
                  className="text-sm text-orange-500 hover:text-orange-400"
                  onClick={() => {
                    setForgotPasswordOpen(true);
                    setForgotPasswordSuccess(false);
                    setForgotPasswordEmail("");
                    setError("");
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}
            {mode === "signup" && (
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
                  required={mode === "signup"}
                  disabled={loading}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            )}
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
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {mode === "login" ? (
                    <LogIn className="mr-2 h-4 w-4" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {mode === "login" ? "Sign In" : "Sign Up"}
                </>
              )}
            </Button>
            <p className="text-sm text-center text-gray-400">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-orange-500 hover:text-orange-400 font-medium"
                    onClick={switchMode}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-orange-500 hover:text-orange-400 font-medium"
                    onClick={switchMode}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your email address and we'll send you a link to reset your
              password.
            </DialogDescription>
          </DialogHeader>
          {forgotPasswordSuccess ? (
            <div className="text-center py-4">
              <div className="text-green-500 mb-2">✓</div>
              <p className="text-gray-300">
                If an account exists with that email, you will receive a
                password reset link shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-900/50 text-red-400 text-sm p-3 rounded-md border border-red-800">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="forgotEmail" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="forgotEmail"
                    type="email"
                    placeholder="name@example.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                    disabled={forgotPasswordLoading}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
