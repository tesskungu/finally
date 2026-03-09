import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });
      setSuccess(true);
      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to reset password");
      } else {
        toast.error("Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-500">
              Invalid Link
            </CardTitle>
            <CardDescription className="text-gray-400">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => navigate("/login")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-500">
              Password Reset!
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your password has been reset successfully. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-gray-300">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-gray-300">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          <Button
            onClick={handleReset}
            disabled={loading || !newPassword || !confirmPassword}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Reset Password
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
