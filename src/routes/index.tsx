import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import landingHtml from "../../public/mapa.html?raw";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import kitMockupAsset from "@/assets/mockup-vet.png.asset.json";
import mapaFundamentos from "@/assets/optimized/mapa-fundamentos-educacao.webp";
import mapaPsicologia from "@/assets/optimized/mapa-psicologia-educacao.webp";
import mapaDidatica from "@/assets/optimized/mapa-didatica-praticas.webp";
import mapaLdb from "@/assets/optimized/mapa-ldb-legislacao.webp";
import mapaBncc from "@/assets/optimized/mapa-bncc.webp";
import mapaDesenvolvimento from "@/assets/optimized/mapa-desenvolvimento-infantil.webp";
import depoimentoReview1 from "@/assets/depoimento-review-1.webp.asset.json";
import depoimentoReview2 from "@/assets/depoimento-review-2.webp.asset.json";
import depoimentoReview3 from "@/assets/depoimento-review-3.webp.asset.json";
import depoimentoReview4 from "@/assets/depoimento-review-4.webp.asset.json";

import bonus1Asset from "@/assets/bonus-1.webp.asset.json";
import bonus2Asset from "@/assets/bonus-2.webp.asset.json";
import bonus3Asset from "@/assets/bonus-3.webp.asset.json";
import bonus4Asset from "@/assets/bonus-4.webp.asset.json";
import bonus5Asset from "@/assets/bonus-5.webp.asset.json";
import bonus6Asset from "@/assets/bonus-6.webp.asset.json";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";
import previewVetAnatomiaAsset from "@/assets/preview-vet-anatomia.png.asset.json";
import previewVetFisiologiaAsset from "@/assets/preview-vet-fisiologia.png.asset.json";
import previewVetFarmacologiaAsset from "@/assets/preview-vet-farmacologia.png.asset.json";
import previewVetPatologiaAsset from "@/assets/preview-vet-patologia.png.asset.json";
import previewVetMicrobiologiaAsset from "@/assets/preview-vet-microbiologia.png.asset.json";
import previewVetNutricaoAsset from "@/assets/preview-vet-nutricao.webp.asset.json";

const ASSET_ORIGIN = "https://id-preview--531366b2-beb6-4ef6-9eba-2f23e6d9493d.lovable.app";
const OWN_PROJECT_ID = "b1371966-8896-4ea0-9dc6-45641ea24dd3";
const assetUrl = (path: string) => `${ASSET_ORIGIN}${path}`;
const assetSrc = (asset: { url: string; project_id: string }) =>
  asset.project_id === OWN_PROJECT_ID ? asset.url : assetUrl(asset.url);
const kitMockup = assetSrc(kitMockupAsset);

const mapas = [
  mapaFundamentos,
  mapaPsicologia,
  mapaDidatica,
  mapaLdb,
  mapaBncc,
];
const bonusImgs = [bonus1Asset, bonus2Asset, bonus3Asset, bonus4Asset, bonus5Asset, bonus6Asset].map(
  (asset) => assetSrc(asset),
);
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

// Cada depoimento tem sua própria foto de produto e seu próprio avatar,
// pareados para que a foto combine com o que a pessoa fala.
const depoimentos: Record<string, { produto: string; avatar: string }> = {
  mariana: { produto: assetSrc(depoimentoReview1), avatar: avatar1 },
  camila: { produto: assetSrc(depoimentoReview2), avatar: avatar2 },
  beatriz: { produto: assetSrc(depoimentoReview3), avatar: avatar3 },
  patricia: { produto: assetSrc(depoimentoReview4), avatar: avatar4 },
};

const slides = [
  { src: assetSrc(previewVetAnatomiaAsset), alt: "Mapa mental de Anatomia Veterinária" },
  { src: assetSrc(previewVetFisiologiaAsset), alt: "Mapa mental de Fisiologia Animal" },
  { src: assetSrc(previewVetFarmacologiaAsset), alt: "Mapa mental de Farmacologia Veterinária" },
  { src: assetSrc(previewVetPatologiaAsset), alt: "Mapa mental de Patologia Veterinária" },
  { src: assetSrc(previewVetMicrobiologiaAsset), alt: "Mapa mental de Microbiologia Veterinária" },
  { src: assetSrc(previewVetNutricaoAsset), alt: "Mapa mental de Nutrição Animal" },
];


function rewriteAssets(html: string) {
  return html
    // carregamento leve: imagens só quando aparecem na tela
    .replace(/<img(?![^>]*\bloading=)/gi, '<img loading="lazy" decoding="async"')
    .replace(/\/assets\/kit_mockup_v2\.webp/g, kitMockup)
    .replace(/\/assets\/mapa_preview_(\d)\.webp/g, (_m, n) => mapas[(Number(n) - 1) % mapas.length] ?? mapaFundamentos)
    .replace(/\/assets\/bonus_(\d)\.webp/g, (_m, n) => bonusImgs[(Number(n) - 1) % bonusImgs.length] ?? bonusImgs[0] ?? "")
    .replace(
      /\/assets\/depoimento_(\w+)_produto\.webp/g,
      (_m, name: string) => depoimentos[name]?.produto ?? assetSrc(depoimentoReview1),
    )
    .replace(
      /\/assets\/depoimento_(\w+)_avatar\.webp/g,
      (_m, name: string) => depoimentos[name]?.avatar ?? avatar1,
    )
    .replace(
      /\/assets\/hero_avatar_(\d)\.webp/g,
      (_m, idx: string) => avatars[(Number(idx) - 1) % avatars.length] ?? avatar1,
    );
}


const rawBody = (landingHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? "")
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .trim();

// The dark "preview" section is replaced by the React coverflow carousel.
const previewSection = /<section class="section section--dark">[\s\S]*?<\/section>/i;
const match = rawBody.match(previewSection);
const splitIndex = match ? (match.index ?? 0) : rawBody.length;

const beforeHtml = rewriteAssets(rawBody.slice(0, splitIndex));
const afterHtml = rewriteAssets(rawBody.slice(splitIndex + (match?.[0].length ?? 0)));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kit de Nutrição Visual — +300 Mapas Mentais Imprimíveis" },
      {
        name: "description",
        content:
          "Estude nutrição de forma visual com mais de 300 mapas mentais imprimíveis. Dos fundamentos da nutrição à prática clínica, revise rápido para provas e residências.",
      },
      { property: "og:title", content: "Kit de Nutrição Visual — +300 Mapas Mentais" },
      {
        property: "og:description",
        content:
          "Mais de 300 mapas mentais ilustrados de nutrição: fundamentos, nutrição clínica, esportiva, saúde coletiva, dietética e avaliação nutricional. Acesso vitalício.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preload", as: "image", href: kitMockup, fetchPriority: "high" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: "/style.css" },
    ],
  }),
  component: Index,
});

function useLandingScript() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    let cleanup: (() => void) | undefined;

    const run = () => {
      const init = (window as unknown as { initLanding?: (r: ParentNode) => (() => void) | void })
        .initLanding;
      if (init) cleanup = init(document) || undefined;
    };

    (window as unknown as { __LANDING_MANUAL_INIT__?: boolean }).__LANDING_MANUAL_INIT__ = true;

    if ((window as unknown as { initLanding?: unknown }).initLanding) {
      run();
    } else {
      const script = document.createElement("script");
      script.src = "/script.js";
      script.onload = run;
      document.body.appendChild(script);
    }

    return () => cleanup?.();
  }, []);

  return containerRef;
}

function Index() {
  const containerRef = useLandingScript();

  return (
    <div ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: beforeHtml }} />

      <section className="section section--dark">
        <div className="container">
          <span className="section-label">O Material por Dentro</span>
          <h2 className="section-title" style={{ color: "#ffffff" }}>
            Veja como o material é por dentro
          </h2>
          <p className="section-subtitle">
            Mapas ilustrados e organizados por disciplina para facilitar seus estudos e revisões
            rápidas. Arraste para explorar.
          </p>

          <CoverflowCarousel
            slides={slides}
            cardWidth="clamp(230px, 68vw, 320px)"
            cardAspect={1}
            className="text-white"
            cardClassName="bg-white p-1"
            showNavigation
            showPagination
            label="Prévia dos mapas mentais"
          />

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="#value-stack-section" className="btn-cta">
              Quero Garantir Agora
            </a>
          </div>
        </div>
      </section>

      <div dangerouslySetInnerHTML={{ __html: afterHtml }} />
    </div>
  );
}
