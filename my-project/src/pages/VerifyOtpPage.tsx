import { useSignUp } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function VerifyOtpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  // Redirect if signup object is missing (e.g., page refresh)
  useEffect(() => {
    if (isLoaded && !signUp) {
      console.warn("No signup object found, redirecting to signup");
      navigate("/signup");
    }
  }, [isLoaded, signUp, navigate]);

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError("");

    console.log("Attempting OTP verification...");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      console.log("OTP verification result:", completeSignUp.status);

      if (completeSignUp.status !== "complete") {
        console.log("Signup incomplete, additional steps may be required:", JSON.stringify(completeSignUp, null, 2));
        setError("Account setup incomplete. Please contact support.");
      } else {
        console.log("Verification successful! Setting active session...");
        await setActive({ session: completeSignUp.createdSessionId });
        console.log("Session active, navigating to dashboard");
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Verification error:", err);
      if (err instanceof Error) {
        // @ts-ignore
        const clerkError = (err as any).errors?.[0]?.message || err.message;
        setError(clerkError || "Invalid or expired code. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !signUp || resendCooldown > 0) return;

    setResendLoading(true);
    setError("");

    console.log("Resending OTP...");

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      console.log("OTP resent successfully");
      setResendCooldown(60);
      alert("New code sent to your email!");
    } catch (err: unknown) {
      console.error("Resend error:", err);
      if (err instanceof Error) {
        // @ts-ignore
        const clerkError = (err as any).errors?.[0]?.message || err.message;
        setError(clerkError || "Failed to resend code. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="bg-background text-on-surface grainy-bg min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed font-jakarta overflow-x-hidden">
      <main className="grow flex items-center justify-center py-10 px-gutter relative">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-120 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl ambient-shadow p-8 md:p-12 my-8 relative z-10 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 mb-4">
              <Logo size={64} className="rounded-xl shadow-sm" />
            </div>
            <h1 className="font-headline-md text-headline-md text-primary mb-2">Verify Your Email</h1>
            <p className="font-body-md text-on-surface-variant max-w-75 mx-auto">
              We've sent a 6-digit code to <span className="text-primary font-bold">{signUp?.emailAddress || "your email"}</span>.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleVerify}>
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-label-md animate-shake border border-error/10">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block px-1" htmlFor="code">Verification Code</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/40 group-focus-within:text-primary transition-colors text-xl">key</span>
                  <input 
                    className="w-full pl-12 pr-4 h-14 bg-surface border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 placeholder:text-outline/30 font-body-md tracking-[0.5em] text-center text-xl" 
                    id="code" 
                    placeholder="000000" 
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              className="w-full h-14 bg-primary text-on-primary font-label-md text-label-md rounded-xl inner-glow flex items-center justify-center gap-3 hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 transform active:scale-[0.97] shadow-lg shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden" 
              type="submit"
              disabled={isLoading || code.length !== 6}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>
              <span className="relative z-10">{isLoading ? "Verifying..." : "Verify Account"}</span>
              <span className="material-symbols-outlined text-[20px] relative z-10 group-hover:translate-x-1 transition-transform">verified</span>
            </button>
          </form>

          <div className="mt-8 text-center border-t border-outline-variant/10 pt-6">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Didn't receive the code? 
              <button 
                className="text-primary font-bold hover:text-primary-container transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResend}
                disabled={resendLoading || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resendLoading ? "Sending..." : "Resend Code"}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link className="text-outline text-label-sm hover:text-primary transition-colors" to="/signup">
              Use a different email address
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
