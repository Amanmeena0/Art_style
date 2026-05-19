import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-lg md:p-xl ambient-shadow border border-outline-variant/10 relative z-10 animate-fadeIn">
          <div className="text-center mb-xl">
            <div className="flex justify-center mb-sm">
              <span className="material-symbols-outlined text-primary text-4xl">energy_savings_leaf</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-primary mb-xs">Botanical Merge</h1>
            <p className="font-body-md text-on-surface-variant">Welcome back to your intentional studio.</p>
          </div>

          <form className="space-y-md" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-label-md animate-shake">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant block px-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <input 
                  className="w-full h-14 px-md bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container placeholder:text-outline/50 transition-all duration-300 outline-none" 
                  id="email" 
                  placeholder="hello@creator.com" 
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-xs">
              <div className="flex justify-between items-center px-1">
                <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="password">Password</label>
                <Link className="font-label-sm text-label-sm text-secondary hover:text-secondary-container transition-colors" to="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input 
                  className="w-full h-14 px-md bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container placeholder:text-outline/50 transition-all duration-300 outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className="w-full h-14 bg-primary text-on-primary font-label-md text-label-md rounded-full inner-glow flex items-center justify-center gap-sm hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-xl text-center">
            <p className="font-label-md text-label-md text-on-surface-variant">
              New to the studio? 
              <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1" to="/signup">Create an Account</Link>
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
