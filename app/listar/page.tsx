"use client";

import "@/app/css/Listar.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

/* eslint-disable @next/next/no-img-element */

type Product = {
  id: string;
  nome: string;
  imagens: string[]; // ✅ agora vem como array
  descricao: string;
  preco: number;
  tipo: string;
  marca: string;
  criadoEm: Date | { seconds: number; nanoseconds: number };
};

export default function ListarPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<string>("roupa"); // ✅ filtro inicial
  const router = useRouter();

  useEffect(() => {
    loadProducts(selectedType);
  }, [selectedType]);

  async function loadProducts(type?: string) {
    let q;
    if (type) {
      q = query(collection(db, "produtos"), where("tipo", "==", type));
    } else {
      q = collection(db, "produtos");
    }

    const snapshot = await getDocs(q);
    const data: Product[] = snapshot.docs.map((docSnap) => {
      const docData = docSnap.data();
      return {
        id: docSnap.id,
        nome: docData.nome ?? "",
        imagens: docData.imagens ?? [], // ✅ pega array salvo
        descricao: docData.descricao ?? "",
        preco: Number(docData.preco) ?? 0,
        tipo: docData.tipo ?? "",
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
    await loadProducts(selectedType);
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

      <main>
        <h2 className="h2-list">Selecione para Editar</h2>

        <div className="search-box bg-white text-black">
          <input type="text" placeholder="Buscar" />
          <button>
            <img src="/assets/pesquisar.png" alt="Buscar" className="icon-busca" />
          </button>
        </div>

        {/* filtros */}
        <div className="filters">
          <button
            className={`filter ${selectedType === "roupa" ? "active" : ""}`}
            onClick={() => setSelectedType("roupa")}
          >
            PEÇAS
          </button>
          <button
            className={`filter ${selectedType === "tenis" ? "active" : ""}`}
            onClick={() => setSelectedType("tenis")}
          >
            TÊNIS
          </button>
          <button
            className={`filter ${selectedType === "acessorio" ? "active" : ""}`}
            onClick={() => setSelectedType("acessorio")}
          >
            ACESSÓRIOS
          </button>
        </div>

        <div className="cards">
          {/* Botão para adicionar */}
          <div className="card add" onClick={() => router.push("/criar")}>
            <span>+</span>
            <p>Adicione</p>
          </div>

          {/* Listagem de produtos */}
          {products.map((product) => (
            <div key={product.id} className="card relative">
              <div className="h-2/3 flex items-center justify-center">
                <img
                  src={product.imagens[0] ?? "/assets/placeholder.png"} // ✅ primeira imagem do vetor
                  alt={product.nome}
                  onClick={() => router.push(`/criar?id=${product.id}`)}
                  className="cursor-pointer h-2/3 object-contain"
                />
              </div>
              <div className="h-1/3 flex flex-col items-center justify-center">
                <p>{product.nome}</p>
                <span
                  className="delete-icon custom-delete-icon"
                  onClick={() => handleDelete(product.id, product.nome)}
                >
                  🗑️
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
