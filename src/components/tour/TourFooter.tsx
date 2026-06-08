import { EMAIL_CONTACT } from "./tour-data";

interface Props {
  t: (path: string) => string;
}

export function TourFooter({ t }: Props) {
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
          <p className="f-tag">"We guide you home."</p>
          <div className="f-contact">
            <a href={EMAIL_CONTACT}>services@kingsncompany.com</a>
            <a href="https://www.kingsncompany.com">www.kingsncompany.com</a>
          </div>
        </div>
        <div className="f-col">
          <h4>Tours</h4>
          <ul>
            <li><a href="#overview">Private Tours</a></li>
            <li><a href="#group">Group Tours</a></li>
            <li><a href="#destinations">Destinations</a></li>
            <li><a href="#tours">Upcoming Dates</a></li>
          </ul>
        </div>
        <div className="f-col">
          <h4>Countries</h4>
          <ul>
            <li><a href="#destinations">Portugal</a></li>
            <li><a href="#destinations">Cabo Verde</a></li>
            <li><a href="#destinations">Lisbon</a></li>
            <li><a href="#destinations">Algarve</a></li>
          </ul>
        </div>
        <div className="f-col">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About KnC</a></li>
            <li><a href="/services">All Services</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bot">
        <p>{t("footer.copy")}</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>Portugal · Cabo Verde</p>
      </div>
    </footer>
  );
}