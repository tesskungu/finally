import nodemailer from "nodemailer";

// Create transporter for sending emails
// Configure with your Gmail SMTP settings
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASS || "your-app-password",
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER || "your-email@gmail.com",
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #666; font-size: 16px;">
          You requested a password reset for your Fabric Studio account.
        </p>
        <p style="color: #666; font-size: 16px;">
          Click the button below to reset your password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          If you didn't request this, please ignore this email. This link will expire in 1 hour.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Fabric Studio - Your Fabric Visualization Platform
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
