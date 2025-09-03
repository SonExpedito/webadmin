import { Suspense } from "react";
import NovoProduto from "@/pages/NovoProduto/page"; // Adjust the path if necessary
// ...existing imports...

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NovoProduto />
    </Suspense>
    );
  }