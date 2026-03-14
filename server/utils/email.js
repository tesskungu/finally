import nodemailer from "nodemailer";

// Create transporter for sending emails
// Configure with your Gmail SMTP settings or other email service
const createTransporter = () => {
  // Check if email credentials are configured
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass || emailUser === "your-email@gmail.com") {
    console.warn(
      "⚠️  Email credentials not configured. Emails will not be sent.",
    );
    console.warn(
      "To enable emails, set EMAIL_USER and EMAIL_PASS environment variables.",
    );
    // Return a mock transporter for development
    return {
      sendMail: async (options) => {
        console.log("📧 Mock email would be sent:");
        console.log("  To:", options.to);
        console.log("  Subject:", options.subject);
        return { messageId: "mock-message-id" };
      },
    };
  }

  console.log(`📧 Email configured for: ${emailUser}`);

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

// Verify email configuration on startup
export const verifyEmailConfig = async () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass || emailUser === "your-email@gmail.com") {
    console.warn("⚠️  Email not configured - emails will be mocked");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.verify();
    console.log("✅ Email server connection verified!");
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:", error.message);
    console.error("   Make sure:");
    console.error("   1. EMAIL_USER is your Gmail address");
    console.error(
      "   2. EMAIL_PASS is a Gmail App Password (not your regular password)",
    );
    console.error(
      "   3. 2-Factor Authentication is enabled on your Google account",
    );
    return false;
  }
};

// Send welcome email on signup
export const sendWelcomeEmail = async (email, firstName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || "Fabric Studio <your-email@gmail.com>",
    to: email,
    subject: "Welcome to Fabric Studio!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Fabric Studio${firstName ? `, ${firstName}` : ""}!</h2>
        <p style="color: #666; font-size: 16px;">
          Thank you for signing up for Fabric Studio.
        </p>
        <p style="color: #666; font-size: 16px;">
          You can now:
        </p>
        <ul style="color: #666; font-size: 16px;">
          <li>Create custom fabric designs</li>
          <li>Preview designs on various products</li>
          <li>Save and manage your designs</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard" style="background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Start Designing
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          If you have any questions, feel free to reply to this email.
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
    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
    // Return false instead of throwing to prevent 500 errors
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || "Fabric Studio <your-email@gmail.com>",
      to: email,
      subject: "Password Reset Request - Fabric Studio",
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

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error.message);
    // Return true anyway to not reveal email existence
    return true;
  }
};
