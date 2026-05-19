import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  const { isLoaded, signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      // Create user with name in publicMetadata or handle via Clerk's firstName/lastName split
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // In a real app, you'd redirect to a verification page. 
      // For simplicity in this mockup, we'll assume direct completion or let the user know.
      alert("Verification email sent! Please check your inbox.");
      // navigate("/verify-email"); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface grainy-bg min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed font-jakarta overflow-x-hidden">
      <main className="grow flex items-center justify-center py-10 px-gutter relative">
        {/* Decorative Botanical Background Elements */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Visual Anchor / Side Image for Web */}
        <div className="hidden lg:block absolute left-xl top-1/2 -translate-y-1/2 w-64 h-150 rounded-full overflow-hidden opacity-40 pointer-events-none">
          <img 
            alt="Botanical Texture" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9n2u1lnaeC7qwyMMWffIETqiXfFwQbChPcRdgTjzx1LCOHZ5D4VVYD5kPCKZk6lPT3GorR6WVSghL2wEqCLfOTOC9Bo3bVeciW2D0R3crsjRDVG-z8HTL2xkzKYoYdd3n1HyBDGy5deavg4CCb4Octh2IJiNi7zINGhWQmmP8ZbgdgH4A-j7soPddk0xbBugSiRTtQVi_urXBVImC5EZqo9MeqXB2UqEb9Z8yHJOJn4cs8mMm5uZqSS2ZYJedBNaZaplJKVFD1Tw" 
          />
        </div>

        {/* Sign Up Card Container */}
        <div className="w-full max-w-120 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl ambient-shadow p-8 md:p-12 my-8 relative z-10 animate-fadeIn">
          {/* Brand & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/5 rounded-2xl mb-4">
              <span className="material-symbols-outlined text-primary text-[32px]">potted_plant</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-primary mb-2">Begin Your Studio</h1>
            <p className="font-body-md text-on-surface-variant max-w-75 mx-auto">Create an account to save your intentional creations.</p>
          </div>

          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-label-md animate-shake border border-error/10">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block px-1" htmlFor="name">Full Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/40 group-focus-within:text-primary transition-colors text-xl">person</span>
                  <input 
                    className="w-full pl-12 pr-4 h-14 bg-surface border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 placeholder:text-outline/30 font-body-md" 
                    id="name" 
                    placeholder="Evelyn Green" 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block px-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/40 group-focus-within:text-primary transition-colors text-xl">mail</span>
                  <input 
                    className="w-full pl-12 pr-4 h-14 bg-surface border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 placeholder:text-outline/30 font-body-md" 
                    id="email" 
                    placeholder="evelyn@studio.com" 
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block px-1" htmlFor="password">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/40 group-focus-within:text-primary transition-colors text-xl">lock</span>
                  <input 
                    className="w-full pl-12 pr-12 h-14 bg-surface border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 placeholder:text-outline/30 font-body-md" 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/40 hover:text-primary transition-colors" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 px-1">
              <div className="flex items-center h-5">
                <input 
                  className="w-5 h-5 rounded border-outline-variant/50 text-primary focus:ring-primary bg-surface-bright cursor-pointer" 
                  id="terms" 
                  required 
                  type="checkbox"
                />
              </div>
              <label className="font-label-md text-label-md text-on-surface-variant leading-tight" htmlFor="terms">
                I agree to the <a className="text-primary hover:underline font-bold" href="#">Terms</a> and <a className="text-primary hover:underline font-bold" href="#">Privacy</a>.
              </label>
            </div>

            {/* Primary Action */}
            <button 
              className="w-full h-14 bg-primary text-on-primary font-label-md text-label-md rounded-xl inner-glow flex items-center justify-center gap-3 hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 transform active:scale-[0.97] shadow-lg shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden" 
              type="submit"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>
              <span className="relative z-10">{isLoading ? "Creating..." : "Create Account"}</span>
              <span className="material-symbols-outlined text-[20px] relative z-10 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Secondary Navigation */}
          <div className="mt-10 text-center border-t border-outline-variant/10 pt-8">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Already have a studio? 
              <Link className="text-primary font-bold hover:text-primary-container transition-colors ml-2" to="/signin">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
