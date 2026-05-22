import AlertBanner from "@/components/AlertBanner";
import TopBar from "@/components/TopBar";
import HeroSection from "@/components/HeroSection";
import DisclaimerBar from "@/components/DisclaimerBar";
import GroPgrSection from "@/components/GroPgrSection";
import AbrangenciaSection from "@/components/AbrangenciaSection";
import PsicossociaisSection from "@/components/PsicossociaisSection";
import CronogramaSection from "@/components/CronogramaSection";
import ChecklistSection from "@/components/ChecklistSection";
import PenalidadesSection from "@/components/PenalidadesSection";
import PortariaSection from "@/components/PortariaSection";
import LeigosSection from "@/components/LeigosSection";
import ModelosSection from "@/components/ModelosSection";
import FaqSection from "@/components/FaqSection";
import LgpdSection from "@/components/LgpdSection";
import CtaSection from "@/components/CtaSection";
import IviSection from "@/components/IviSection";
import PrecosSection from "@/components/PrecosSection";
import ContatoSection from "@/components/ContatoSection";
import FooterSection from "@/components/FooterSection";
import ScrollReveal from "@/components/ScrollReveal";

const Index = () => (
  <>
    <AlertBanner />
    <TopBar />
    <HeroSection />
    <DisclaimerBar />
    <ScrollReveal><GroPgrSection /></ScrollReveal>
    <ScrollReveal><AbrangenciaSection /></ScrollReveal>
    <ScrollReveal><PsicossociaisSection /></ScrollReveal>
    <ScrollReveal><CronogramaSection /></ScrollReveal>
    <ScrollReveal><ChecklistSection /></ScrollReveal>
    <ScrollReveal><PenalidadesSection /></ScrollReveal>
    <ScrollReveal><PortariaSection /></ScrollReveal>
    <ScrollReveal><LeigosSection /></ScrollReveal>
    <ScrollReveal><ModelosSection /></ScrollReveal>
    <ScrollReveal><FaqSection /></ScrollReveal>
    <ScrollReveal><LgpdSection /></ScrollReveal>
    <ScrollReveal><IviSection /></ScrollReveal>
    <ScrollReveal><PrecosSection /></ScrollReveal>
    <ScrollReveal><ContatoSection /></ScrollReveal>
    <CtaSection />
    <FooterSection />
  </>
);

export default Index;
