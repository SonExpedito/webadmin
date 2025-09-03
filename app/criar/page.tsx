"use client";

import "@/app/css/criar.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

/* eslint-disable @next/next/no-img-element */

interface Produto {
  nome: string;
  preco: string;
  descricao: string;
  numero: string;
  marca: string;
  tipo: string; // novo campo
  imagens: string[];
  itemLink?: string;
}

export default function NovoProduto() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const produtoId = searchParams.get("id");

  const [form, setForm] = useState<Produto>({
    nome: "",
    preco: "",
    descricao: "",
    numero: "",
    marca: "nike",
    tipo: "roupa",
    imagens: [],
    itemLink: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [original, setOriginal] = useState<Produto | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // estados do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  useEffect(() => {
    const fetchProduto = async () => {
      if (!produtoId) return;
      const docRef = doc(db, "produtos", produtoId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return;

      const data = snap.data() as Produto;
      setForm(data);
      setOriginal(data);
      setMainImageIndex(0);
    };
    fetchProduto();
  }, [produtoId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const totalImagens = [
      ...form.imagens,
      ...selectedFiles.map((f) => URL.createObjectURL(f)),
    ].slice(0, 3);

    setFiles((prev) => [...prev, ...selectedFiles].slice(0, 3));
    setForm((prev) => ({ ...prev, imagens: totalImagens }));
    setMainImageIndex(0);
  };

  const removeImage = (index: number) => {
    const novasImagens = form.imagens.filter((_, i) => i !== index);
    setForm({ ...form, imagens: novasImagens });
    setFiles((prev) => prev.filter((_, i) => i !== index));

    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex((prev) => prev - 1);
    }
  };

  const handleCancel = () => {
    if (original) {
      setForm(original);
      setFiles([]);
      setMainImageIndex(0);
    } else {
      setForm({
        nome: "",
        preco: "",
        descricao: "",
        numero: "",
        marca: "nike",
        tipo: "roupa",
        imagens: [],
        itemLink: "",
      });
      setFiles([]);
      setMainImageIndex(0);
    }
  };

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Erro no upload para Cloudinary");
  }

  const data = await res.json();
  return data.secure_url as string;
};


  const handleSave = async () => {
    if (!form.nome.trim()) {
      setModalMsg("Digite o nome do produto.");
      setModalSuccess(false);
      setModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const imagensExistentes = form.imagens.filter((img) => img.startsWith("http"));

      const novasImagens = await Promise.all(files.map(uploadToCloudinary));

      const imagens = [...imagensExistentes, ...novasImagens].slice(0, 3);

      const dataToSave = { ...form, imagens };

      if (produtoId) {
        await updateDoc(doc(db, "produtos", produtoId), dataToSave);
      } else {
        const newDocRef = doc(db, "produtos", crypto.randomUUID());
        await setDoc(newDocRef, dataToSave);
      }

      setModalMsg("Produto salvo com sucesso!");
      setModalSuccess(true);
      setModalOpen(true);

      setTimeout(() => {
        router.push("/listar");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setModalMsg("Erro ao salvar produto. Tente novamente.");
      setModalSuccess(false);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="headercriar">
        <Link href="/dashboard" className="back-btn">
          <img src="/assets/voltar.png" alt="Ícone Voltar" />
          <p className="text-black">Voltar</p>
        </Link>
      </header>

      <div className="criacao-wrapper">
        <h2 className="titulo-secundario">Selecione para Editar</h2>
        <div className="editor-area">
          {/* Coluna de Imagens */}
          <div className="imagem-col">
            <div className="imagem-principal">
              {form.imagens[mainImageIndex] ? (
                <img
                  src={form.imagens[mainImageIndex]}
                  alt="Principal"
                  className="img-principal"
                />
              ) : (
                <span className="placeholder-img">Adicionar imagem</span>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesChange}
                className="input-file"
              />
            </div>
            <div className="miniaturas">
              {form.imagens.map((url, i) => (
                <div
                  key={i}
                  className={`miniatura-wrapper ${
                    i === mainImageIndex ? "ativa" : ""
                  }`}
                >
                  <img
                    src={url}
                    alt={`Preview ${i + 1}`}
                    className="miniatura"
                    onClick={() => setMainImageIndex(i)}
                  />
                  <button
                    type="button"
                    className="btn-remove-miniatura"
                    onClick={() => removeImage(i)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              {form.imagens.length < 3 && (
                <button
                  type="button"
                  className="miniatura miniatura-add"
                  onClick={() => {
                    const input =
                      document.querySelector<HTMLInputElement>(".input-file");
                    input?.click();
                  }}
                >
                  +
                </button>
              )}
            </div>
          </div>

          {/* Coluna Formulário */}
          <div className="form-col">
            <input
              type="text"
              name="nome"
              value={form.nome ?? ""}
              onChange={handleChange}
              placeholder="Nome"
              className="input-form"
            />
            <input
              type="number"
              name="preco"
              value={form.preco ?? ""}
              onChange={handleChange}
              placeholder="Preço"
              className="input-form"
            />
            <input
              type="text"
              name="itemLink"
              value={form.itemLink ?? ""}
              onChange={handleChange}
              placeholder="Link do produto"
              className="input-form"
            />
            <select
              name="tipo"
              value={form.tipo ?? ""}
              onChange={handleChange}
              className="input-form select"
            >
              <option value="roupa">Roupa</option>
              <option value="tenis">Tênis</option>
              <option value="acessorio">Acessório</option>
            </select>
            <textarea
              name="descricao"
              value={form.descricao ?? ""}
              onChange={handleChange}
              placeholder="Descrição"
              className="input-form"
            />
            <div className="acoes-form">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-add"
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-cancel"
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de feedback */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className={modalSuccess ? "text-green-600" : "text-red-600"}>
              {modalMsg}
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="btn btn-close"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
