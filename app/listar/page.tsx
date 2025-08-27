'use client';

import "@/app/css/Listar.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
/* eslint-disable @next/next/no-img-element */

type Product = {
    id: string;
    nome: string;
    imagemUrl: string;
    imagemUrl2?: string;
    imagemUrl3?: string;
    descricao: string;
    preco: number;
    type: string;
    marca: string;
    criadoEm: Date | { seconds: number; nanoseconds: number };
};

export default function ListarPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const snapshot = await getDocs(collection(db, "produtos"));
        const data: Product[] = snapshot.docs.map((docSnap) => {
            const docData = docSnap.data();
            return {
                id: docSnap.id,
                nome: docData.nome ?? "",
                imagemUrl: docData.imagemUrl ?? "",
                imagemUrl2: docData.imagemUrl2 ?? "",
                imagemUrl3: docData.imagemUrl3 ?? "",
                descricao: docData.descricao ?? "",
                preco: docData.preco ?? 0,
                type: docData.type ?? "",
                marca: docData.marca ?? "",
                criadoEm: docData.criadoEm ?? new Date(),
            };
        });
        setProducts(data);
    }

    async function handleDelete(id: string, nome: string) {
        if (!confirm(`Deseja excluir o produto "${nome}"?`)) return;
        await deleteDoc(doc(db, "produtos", id));
        alert("Produto excluído com sucesso!");
        await loadProducts();
    }

    return (
        <>
            <header className="headerlist ">
                <Link href="/dashboard" className="back-btn ">
                    <img src="/assets/voltar.png" alt="Ícone Voltar" />
                    <p className="text-black">Voltar</p>
                </Link>

                <div className="botaolist bg-[#FF0040]">
                    <span className="text-botaolist">PEÇAS</span>
                    <div className="img-area">
                        <img src="/assets/camiseta.png" alt="Peças" />
                    </div>
                </div>

                <div className="profile">
                    <img src="/assets/perfil.jpg" alt="Perfil" className="object-cover" />
                    <span className="text-black">Funcionário</span>
                </div>
            </header>

            <main >
                <h2 className="h2-list">Selecione para Editar</h2>

                <div className="search-box bg-white text-black">
                    <input type="text" placeholder="Buscar" />
                    <button>
                        <img src="/assets/pesquisar.png" alt="Buscar" className="icon-busca" />
                    </button>
                </div>

                <div className="filters">
                    <button className="filter active">PEÇAS</button>
                    <button className="filter">TÊNIS</button>
                </div>

                <div className="cards">
                    {/* Botão para adicionar */}
                    <div className="card add" onClick={() => router.push("/criar")}>
                        <span>+</span>
                        <p>Adicione</p>
                    </div>

                    {/* Listagem de produtos */}
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="card relative"
                        >
                            <img
                                src={product.imagemUrl}
                                alt={product.nome}
                                onClick={() => router.push(`/criar?id=${product.id}`)}
                                style={{ cursor: "pointer" }}
                            />
                            <p>{product.nome}</p>
                            <span
                                className="delete-icon custom-delete-icon"
                                onClick={() => handleDelete(product.id, product.nome)}
                            >
                                🗑️
                            </span>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}
