import "@/app/css/Dashboard.css";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */

export default function Dashboard() {
    return (
        <>
            <header className="dashboardheader">
                <div className="perfil">
                    <p>Seja Bem Vindo, Funcionário</p>
                    <img src="/assets/perfil.jpg" alt="Foto de perfil" className="object-cover" />
                </div>
            </header>
            <main className="dashmain">
                <div className="bloco-titulo-e-pecas"></div>
                <h2 className="titulo-sobre">O que temos pra hoje?</h2>
                <div className="botoes">
                    <Link
                        href="/listar"
                        className="botao"
                        style={{ "--cor": "#FF0040" } as React.CSSProperties}
                    >
                        <span className="text-botao">PEÇAS</span>
                        <img src="/assets/camiseta.png" alt="Peças" />
                    </Link>
                    <div
                        className="botao"
                        style={{ "--cor": "#00BFFF" } as React.CSSProperties}
                    >
                        <span className="text-botao">MARCAS</span>
                        <img src="/assets/tenis.png" alt="Marcas" />
                    </div>
                    <div
                        className="botao"
                        style={{ "--cor": "#00FFBF" } as React.CSSProperties}
                    >
                        <span className="text-botao">ARTISTAS</span>
                        <img src="/assets/artista.png" alt="Artistas" />
                    </div>
                    <div
                        className="botao"
                        style={{ "--cor": "#FFD700" } as React.CSSProperties}
                    >
                        <span className="text-botao">OUTROS</span>
                        <img src="/assets/sacola.png" alt="Outros" />
                    </div>

                      <Link
                        href="/politicas"
                        className="botao"
                        style={{ "--cor": "#FF8C00" } as React.CSSProperties}
                    >
                        <span className="text-botao">POLÍTICAS</span>
                        <img src="/assets/privacidade.png" className="object-contain h-[90%]" alt="Políticas" />
                    </Link>

                </div>
            </main>
        </>
    );
}