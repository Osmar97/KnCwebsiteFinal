import { Reveal } from "@/components/tour/Reveal";

type T = (path: string) => any;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Single source of truth for the Tour page primary CTAs.
 * - "Book Private Tour" → smooth-scrolls to the Private Tour section (#private).
 * - "Join a Group Tour" → smooth-scrolls to the Waitlist section (#waitlist).
 */
export function TourHeroCTAButtons({ t }: { t: T }) {
  return (
    <div className="hero-ctas">
      <a
        href="#private"
        className="btn-primary"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("private");
        }}
      >
        {t("hero.cta_book_private")}
      </a>
      <a
        href="#waitlist"
        className="btn-outline"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("waitlist");
        }}
      >
        {t("hero.cta_join_group")}
      </a>
    </div>
  );
}

/** Standalone section wrapper that reuses the hero CTA buttons. */
export function TourCTASection({ t }: { t: T }) {
  return (
    <section className="cta-block-section">
      <div className="t-container">
        <Reveal>
          <TourHeroCTAButtons t={t} />
        </Reveal>
      </div>
    </section>
  );
}