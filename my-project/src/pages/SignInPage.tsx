import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle the submission of the sign-in form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/studio");
      } else {
        /* secondary strategy may be necessary */
        console.log(result);
      }
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
    <div className="bg-background text-on-surface grainy-bg min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed font-jakarta">
      <main className="grow flex items-center justify-center px-gutter py-xl relative overflow-hidden">
        {/* Decorative Watermark Elements */}
        <div className="absolute top-0 right-0 w-1/3 opacity-5 pointer-events-none botanical-mask translate-x-1/4 -translate-y-1/4">
          <img 
            alt="Decorative leaf watermark" 
            className="w-full h-auto" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy3sBZe6Y15MRTHPud7moy15Wvs-fW-ieFDLOBfJmIRKdbvWYPuALioSSWl31sBMJhCsIJrkbtqwx8wozMft99PRUkeT8t0KtZ9wtpJtoc7fUYJ5prlJcZqaW7XkpGymPeRG1MqT9f9PPxyFnBh6a7nBDQpxaBnweFSGwWBa0lI_63hkoqkzlL68PcNY4Jl9_4fBgB146fW5EqmoJs4NMV0GRXbO9wCOQj5xW9DpGBZMHomJuYEzlvDCiVE8cReuCWo5QJ23e5CDo" 
          />
        </div>
        <div className="absolute bottom-0 left-0 w-1/4 opacity-5 pointer-events-none botanical-mask -translate-x-1/4 translate-y-1/4 rotate-45">
          <img 
            alt="Decorative floral watermark" 
            className="w-full h-auto" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi9DDc8zadKQ2qeUD0JMqhUogijXkWYwxfnx1Pbi9VFpgqZNKF4JsqrPIX3nUQoWZeUsU3rjINtavneHyP4YxjD9k5YrZpEaODOj_MAj7owJ3xcQTFO0_Y8pgZ2I52MsJfFYFrNJ8-RFqEXhnI1viR-TgQQ4aw6_2psxhisZOQ35MpAxKwh8aCrBixo1WUrifgD23HlQ9q6vOvSxOq1cHeOuqZtuQdub2EXsdpqg8oW8L3KopZ0xc70EXMx_oqxEO3Av-sR8fVnyA" 
          />
        </div>

        {/* Centered Sign-In Card */}
        <div className="w-full max-w-115 bg-surface-container-lowest rounded-3xl p-xl md:p-12 ambient-shadow border border-outline-variant/10 relative z-10 animate-fadeIn">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 mb-6">
              <Logo size={64} className="rounded-xl shadow-sm" />
            </div>
            <h1 className="font-headline-md text-headline-md text-primary mb-2">Welcome Back</h1>
            <p className="font-body-md text-on-surface-variant max-w-70 mx-auto">Enter your credentials to access your botanical studio.</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-label-md animate-shake border border-error/10 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant block px-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <input 
                    className="w-full h-14 px-md bg-surface border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface-container-lowest placeholder:text-outline/30 transition-all duration-300 outline-none font-body-md" 
                    id="email" 
                    placeholder="e.g. clara@botany.com" 
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-outline/30 group-focus-within:text-primary/40 transition-colors">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="password">Password</label>
                  <Link className="font-label-sm text-label-sm text-secondary hover:text-secondary-container transition-colors font-semibold" to="/forgot-password">Forgot?</Link>
                </div>
                <div className="relative group">
                  <input 
                    className="w-full h-14 px-md bg-surface border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface-container-lowest placeholder:text-outline/30 transition-all duration-300 outline-none font-body-md" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-outline/30 group-focus-within:text-primary/40 transition-colors">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className="w-full h-14 bg-primary text-on-primary font-label-md text-label-md rounded-xl inner-glow flex items-center justify-center gap-3 hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 transform active:scale-[0.97] shadow-lg shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative" 
              type="submit"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>
              <span className="relative z-10">{isLoading ? "Verifying..." : "Sign In to Studio"}</span>
              <span className="material-symbols-outlined text-[20px] relative z-10 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-10 text-center border-t border-outline-variant/10 pt-8">
            <p className="font-label-md text-label-md text-on-surface-variant">
              New to the studio? 
              <Link className="text-primary font-bold hover:text-primary-container transition-colors ml-2" to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer for Transactional Pages */}
      <footer className="w-full px-gutter py-md text-center">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-center items-center gap-sm">
          <p className="font-label-sm text-label-sm text-on-surface-variant/60">
            © 2024 Botanical Merge Studio. Crafted for intentional creators.
          </p>
          <div className="hidden md:block w-1 h-1 bg-outline-variant/40 rounded-full mx-sm"></div>
          <div className="flex gap-md">
            <a className="font-label-sm text-label-sm text-on-surface-variant/60 hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant/60 hover:text-primary transition-colors" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
