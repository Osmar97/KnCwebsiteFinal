import { EMAIL_CONTACT } from "./tour-data";

interface Props {
  t: (path: string) => any;
}

export function TourFooter({ t }: Props) {
  const tours = t("footer_links.tours") as string[];
  const countries = t("footer_links.countries") as string[];
  const company = t("footer_links.company") as string[];
  const toursHrefs = ["#overview", "#group", "#destinations", "#tours"];
  const countriesHrefs = ["#destinations", "#destinations", "#destinations", "#destinations"];
  const companyHrefs = ["/about", "/services", "/contact", "/privacy-policy"];
  return (
    <footer className="page-footer">
      <div className="footer-top">
        <div>
          <div className="f-logo">
            <div className="f-logo-mark">KnC</div>
            <div className="f-logo-text">
              Kings 'n Company
              <span>Property Ownership Tours</span>
            </div>
          </div>
          <p className="f-tag">{t("footer_links.tagline")}</p>
          <div className="f-contact">
            <a href={EMAIL_CONTACT}>services@kingsncompany.com</a>
            <a href="https://www.kingsncompany.com">www.kingsncompany.com</a>
          </div>
        </div>
        <div className="f-col">
          <h4>{t("footer_links.tours_heading")}</h4>
          <ul>
            {tours.map((label, i) => (
              <li key={i}><a href={toursHrefs[i]}>{label}</a></li>
            ))}
          </ul>
        </div>
        <div className="f-col">
          <h4>{t("footer_links.countries_heading")}</h4>
          <ul>
            {countries.map((label, i) => (
              <li key={i}><a href={countriesHrefs[i]}>{label}</a></li>
            ))}
          </ul>
        </div>
        <div className="f-col">
          <h4>{t("footer_links.company_heading")}</h4>
          <ul>
            {company.map((label, i) => (
              <li key={i}><a href={companyHrefs[i]}>{label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bot">
        <p>{t("footer.copy")}</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>{t("footer_links.region")}</p>
      </div>
    </footer>
  );
}