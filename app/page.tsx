'use client'
import { useRouter } from "next/navigation";
import "@/app/css/login.css"; 

/* eslint-disable @next/next/no-img-element */

export default function Home() {
  const router = useRouter();
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    router.push("/dashboard");
  };
  
  return (
    <main className="bodyLogin">
      <img src="/assets/fundo1.png" className="bg-img img1" alt="" />
      <img src="/assets/fundo2.png" className="bg-img img2" alt="" />
      <img src="/assets/fundo3.png" className="bg-img img3" alt="" />

      <div className="logo">
        <img src="/assets/DECRIA.png" alt="Logo" />
      </div>

      <div className="card-wrapper">
        <div className="card-shadow-dark"></div>
        <div className="card-shadow-light"></div>

        <div className="card">
          <h2>ADM DASHBOARD</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="email" placeholder="Email" required />
            </div>

            <div className="form-group relative">
              <input type="password" id="password" placeholder="Senha" required />

              {/* SVG olho fechado */}
              <svg
                id="eyeClosed"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                className="svg-eye"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.74 21.74 0 0 1 5.1-5.88" />
                <path d="M22 12s-1.64-3.26-5-5.94" />
                <path d="M9.53 9.53a3.5 3.5 0 0 0 4.95 4.95" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>

              {/* SVG olho aberto */}
              <svg
                id="eyeOpen"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                className="svg-eye svg-eye-open"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <button type="submit" className="btn-access">
              Acessar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
