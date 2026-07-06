import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlobalCTA } from "@/components/GlobalCTA";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useEffect } from "react";

const TITLE = "Investing in Portugal Real Estate as an American — A Complete Guide";
const DESCRIPTION =
  "Comprehensive guide for US citizens investing in Portuguese real estate: D7 and D8 visas, tax implications, buying property from abroad, and relocation steps.";
const URL =
  "https://kingsncompany.com/resources/guides/investing-in-portugal-for-americans";

const InvestingInPortugalForAmericans = () => {
  useScrollToTop();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = TITLE;

    const ensureMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      const created = !el;
      if (!el) {
        el = document.createElement("meta");
        document.head.appendChild(el);
      }
      const prev: Record<string, string | null> = {};
      Object.entries(attrs).forEach(([k, v]) => {
        prev[k] = el!.getAttribute(k);
        el!.setAttribute(k, v);
      });
      return () => {
        if (created) el!.remove();
        else Object.entries(prev).forEach(([k, v]) => v === null ? el!.removeAttribute(k) : el!.setAttribute(k, v));
      };
    };

    const ensureLink = (rel: string, href: string) => {
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      const created = !el;
      const prev = el?.getAttribute("href") ?? null;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
      return () => {
        if (created) el!.remove();
        else if (prev !== null) el!.setAttribute("href", prev);
      };
    };

    const cleanups = [
      ensureMeta('meta[name="description"]', { name: "description", content: DESCRIPTION }),
      ensureMeta('meta[property="og:title"]', { property: "og:title", content: TITLE }),
      ensureMeta('meta[property="og:description"]', { property: "og:description", content: DESCRIPTION }),
      ensureMeta('meta[property="og:url"]', { property: "og:url", content: URL }),
      ensureMeta('meta[property="og:type"]', { property: "og:type", content: "article" }),
      ensureLink("canonical", URL),
    ];

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      author: { "@type": "Organization", name: "Kings 'n Company" },
      mainEntityOfPage: URL,
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prevTitle;
      cleanups.forEach((fn) => fn());
      ld.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="pt-[76px] sm:pt-20 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert prose-headings:text-gold prose-a:text-gold">
          <header className="mb-10">
            <p className="text-gold text-sm tracking-widest font-light uppercase mb-4">
              Guide for US Investors
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
              Investing in Portugal Real Estate as an American
            </h1>
            <p className="text-gray-300 mt-6 text-lg font-light">
              A practical guide for US citizens looking to buy property, relocate, or
              build long-term wealth in Portugal — covering visas, taxes, financing,
              and the buying process from abroad.
            </p>
          </header>

          <section>
            <h2>Why Americans Are Moving to Portugal</h2>
            <p>
              Portugal has become one of the most popular destinations for US
              citizens seeking a higher quality of life, a milder cost of living,
              and access to the European Union. Lisbon, Porto, the Algarve, and
              increasingly Madeira attract American investors thanks to political
              stability, safety, English-friendly services, and a transparent
              property market.
            </p>
          </section>

          <section>
            <h2>Visa Options for US Citizens</h2>
            <h3>D7 Visa — Passive Income</h3>
            <p>
              The D7 is designed for retirees and remote workers with stable
              passive income (pensions, dividends, rental income). Minimum income
              roughly tracks the Portuguese minimum wage, plus 50% for a spouse
              and 30% per dependent.
            </p>
            <h3>D8 Visa — Digital Nomad</h3>
            <p>
              The D8 targets remote workers and freelancers earning at least four
              times the Portuguese minimum wage from non-Portuguese sources. It
              offers both a temporary stay visa and a residence permit pathway.
            </p>
            <h3>Golden Visa</h3>
            <p>
              Real estate is no longer an eligible investment route under recent
              reforms, but qualifying investment funds, venture capital, and
              cultural contributions remain. Speak with our advisors for
              up-to-date thresholds.
            </p>
          </section>

          <section>
            <h2>Tax Implications for Americans</h2>
            <p>
              The US taxes citizens on worldwide income, so American investors in
              Portugal must file in both jurisdictions. The US–Portugal tax
              treaty and Foreign Tax Credit usually prevent double taxation. Key
              considerations:
            </p>
            <ul>
              <li>IMT (property transfer tax) and stamp duty at purchase.</li>
              <li>Annual IMI municipal property tax.</li>
              <li>Rental income taxed in Portugal; reported on US Schedule E.</li>
              <li>FBAR and FATCA filings for Portuguese bank accounts.</li>
              <li>Capital gains on sale taxed in Portugal, credited in the US.</li>
            </ul>
          </section>

          <section>
            <h2>Buying Property From Abroad</h2>
            <ol>
              <li>Obtain a Portuguese tax number (NIF) — required for any transaction.</li>
              <li>Open a Portuguese bank account (can be done remotely with a fiscal representative).</li>
              <li>Engage an independent buyer's advocate and lawyer.</li>
              <li>Sign a promissory contract (CPCV) with a 10–30% deposit.</li>
              <li>Complete final deed (Escritura) — typically 30–90 days later.</li>
            </ol>
            <p>
              Most steps can be handled with a power of attorney, so you do not
              need to fly to Portugal to close.
            </p>
          </section>

          <section>
            <h2>Financing as a Non-Resident</h2>
            <p>
              Portuguese banks typically lend non-residents up to 60–70% LTV at
              competitive Euro rates. You will need US tax returns, proof of
              income, and a credit reference. Many of our American clients
              combine a Portuguese mortgage with US-based liquidity for the
              deposit.
            </p>
          </section>

          <section>
            <h2>How Kings 'n Company Helps American Investors</h2>
            <p>
              We guide US-based clients end-to-end: visa strategy, off-market
              property sourcing in Lisbon, Porto, Algarve and Cabo Verde,
              cross-border tax coordination, and long-term property management.
              Book a private consultation to map your relocation and investment
              plan.
            </p>
          </section>
        </article>
      </main>
      <GlobalCTA />
      <Footer />
    </div>
  );
};

export default InvestingInPortugalForAmericans;