import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import QuemSomos from "@/app/components/QuemSomos";
import MissaoVisaoValores from "@/app/components/MissaoVisaoValores";
import ComoFunciona from "@/app/components/ComoFunciona";
import Estrutura from "@/app/components/Estrutura";
import Faq from "@/app/components/Faq";
import AbrirGrupoSection from "@/app/components/AbrirGrupoSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <QuemSomos />
        <MissaoVisaoValores />
        <Estrutura />
        <ComoFunciona />
        <Faq />
        <AbrirGrupoSection />
      </main>
      <Footer />
    </>
  );
}
