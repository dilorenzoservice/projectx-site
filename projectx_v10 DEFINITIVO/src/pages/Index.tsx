import { useEffect } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CookieBanner } from "@/components/CookieBanner";

import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CollectionsSection } from "@/components/sections/CollectionsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { HomeFAQSection } from "@/components/sections/HomeFAQSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { ContactSection } from "@/components/sections/ContactSection";

const Index = () => {

  useEffect(() => {
    document.title = "ProjectX Italia — Busti Artistici in Resina Effetto Marmo";
  }, []);

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="scroll-smooth">
        <HeroSection />
        <ManifestoSection />
        <GallerySection />
        <ProcessSection />
        <CollectionsSection />
        <PricingSection />
        <TestimonialsSection />
        <HomeFAQSection />
        <ValuesSection />
        <ContactSection />
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
};

export default Index;