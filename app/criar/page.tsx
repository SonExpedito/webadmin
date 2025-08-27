"use client";

import "@/app/css/criar.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { db, storage } from "@/firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* eslint-disable @next/next/no-img-element */

interface Produto {
    nome: string;
    preco: string;
    descricao: string;
    numero: string;
    marca: string;
    imagens: string[];
    itemLink?: string;
    imagemUrl?: string; // campo opcional singular vindo do banco
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
        imagens: [],
        itemLink: "",
    });

    const [previews, setPreviews] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [original, setOriginal] = useState<Produto | null>(null);

    useEffect(() => {
        const fetchProduto = async () => {
            if (!produtoId) return;
            const docRef = doc(db, "produtos", produtoId);
            const snap = await getDoc(docRef);
            if (!snap.exists()) return;

            const data = snap.data() as Produto;

            let imagensResolvidas: string[] = [];

            if (data.imagens && data.imagens.length > 0) {
                // já há array de imagens salvo
                imagensResolvidas = await Promise.all(
                    data.imagens.map(async (img) => {
                        if (!img) return "";
                        if (/^https?:\/\//i.test(img)) return img; // já é URL
                        try {
                            const r = ref(storage, img);
                            return await getDownloadURL(r);
                        } catch {
                            return img;
                        }
                    })
                );
            } else if (data.imagemUrl) {
                // novo formato: campo único imagemUrl
                imagensResolvidas = [data.imagemUrl];
            }

            const dataComURLs: Produto = { ...data, imagens: imagensResolvidas };
            setForm(dataComURLs);
            setOriginal(dataComURLs);
            setPreviews(imagensResolvidas);
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
        const selectedFiles = Array.from(e.target.files).slice(0, 3);
        setFiles(selectedFiles);
        setPreviews(selectedFiles.map((f) => URL.createObjectURL(f)));
    };

    const handleCancel = () => {
        if (original) {
            setForm(original);
            setPreviews(original.imagens || []);
            setFiles([]);
        } else {
            setForm({
                nome: "",
                preco: "",
                descricao: "",
                numero: "",
                marca: "nike",
                imagens: [],
                itemLink: "",
            });
            setPreviews([]);
            setFiles([]);
        }
    };

    const handleSave = async () => {
        if (!form.nome.trim()) return alert("Digite o nome do produto");

        setLoading(true);
        try {
            let imagens = form.imagens;

            if (files.length > 0) {
                const uploadPromises = files.map(async (file) => {
                    const imageRef = ref(storage, `produtos/${file.name}-${Date.now()}`);
                    await uploadBytes(imageRef, file);
                    return await getDownloadURL(imageRef);
                });
                imagens = await Promise.all(uploadPromises);
            }

            const dataToSave = { ...form, imagens };

            if (produtoId) {
                await updateDoc(doc(db, "produtos", produtoId), dataToSave);
            } else {
                const newDocRef = doc(db, "produtos", crypto.randomUUID());
                await setDoc(newDocRef, dataToSave);
            }

            router.push("/listar");
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            alert("Erro ao salvar produto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="headercriar ">
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

            <div className="criacao-wrapper">
                <h2 className="titulo-secundario">Selecione para Editar</h2>
                <div className="editor-area">
                {/* Imagens */}
                <div className="imagem-col">
                    <div className="imagem-principal" aria-label="Área de imagens">
                        {previews[0] ? (
                            <img
                                src={previews[0]}
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
                            title="Selecione imagens do produto"
                            placeholder="Selecione imagens do produto"
                        />
                        {previews[0] && (
                            <span
                                className="btn-editar-imagem"
                                title="Trocar imagens"
                                onClick={() => {
                                    const input = document.querySelector<HTMLInputElement>(".input-file");
                                    input?.click();
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        const input = document.querySelector<HTMLInputElement>(".input-file");
                                        input?.click();
                                    }
                                }}
                            >
                                ✎
                            </span>
                        )}
                    </div>
                    <div className="miniaturas">
                        {previews.map((url, i) => (
                            <img
                                key={i}
                                src={url}
                                alt={`Preview ${i + 1}`}
                                className="miniatura"
                            />
                        ))}
                        {previews.length < 3 && (
                            <button
                                type="button"
                                className="miniatura miniatura-add"
                                onClick={() => {
                                    const input = document.querySelector<HTMLInputElement>(".input-file");
                                    input?.click();
                                }}
                                title="Adicionar imagem"
                            >
                                +
                            </button>
                        )}
                    </div>
                </div>

                {/* Formulário */}
                <div className="form-col">
                    <h3 className="titulo-form">Preencha os Campos</h3>
                    <div className="campo">
                        <div className="input-wrapper icon-right">
                            <input
                                type="text"
                                name="nome"
                                value={form.nome ?? ""}
                                onChange={handleChange}
                                placeholder="Nome"
                                className="input-form"
                            />
                            <span className="icon">🏷</span>
                        </div>
                    </div>
                    <div className="campo">
                        <div className="input-wrapper suffix-right">
                            <input
                                type="number"
                                name="preco"
                                value={form.preco ?? ""}
                                onChange={handleChange}
                                placeholder="Preço"
                                className="input-form"
                            />
                            <span className="sufixo">$</span>
                        </div>
                    </div>
                    <div className="campo">
                        <input
                            type="text"
                            name="itemLink"
                            value={form.itemLink ?? ""}
                            onChange={handleChange}
                            placeholder="Link do produto"
                            className="input-form"
                        />
                    </div>
                    <div className="linha-dupla">
                        <div className="campo meio">
                            <input
                                type="number"
                                name="numero"
                                value={form.numero ?? ""}
                                onChange={handleChange}
                                placeholder="Número"
                                className="input-form"
                            />
                        </div>
                        <div className="campo meio">
                            <select
                                name="marca"
                                value={form.marca ?? ""}
                                onChange={handleChange}
                                className="input-form select"
                                aria-label="Marca"
                            >
                                <option value="nike">Nike</option>
                                <option value="adidas">Adidas</option>
                                <option value="puma">Puma</option>
                            </select>
                        </div>
                    </div>
                    <div className="campo">
                        <textarea
                            name="descricao"
                            value={form.descricao ?? ""}
                            onChange={handleChange}
                            placeholder="Descrição"
                            className="input-form textarea"
                        />
                    </div>

                    <div className="acoes-form">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="btn btn-add"
                        >
                            {loading ? "Salvando..." : "Adicionar"}
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
        </>
    );
}
