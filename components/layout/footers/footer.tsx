import Link from "next/link";
import { FOOTER_DATA } from "@/lib/footer";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">

        {/* Brand */}
        <div className="footer-brand">
          <h3>{FOOTER_DATA.brand.name}</h3>
          <p>{FOOTER_DATA.brand.description}</p>
        </div>

        {/* Navigation */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <h4>{FOOTER_DATA.nav.title}</h4>
          <ul>
            {FOOTER_DATA.nav.links.map(link => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="footer-contact">
          <h4>{FOOTER_DATA.contact.title}</h4>
          <a href={`mailto:${FOOTER_DATA.contact.email}`}>
            {FOOTER_DATA.contact.email}
          </a>
        </div>

      </div>

      {/* Bottom row */}
      <div className="site-footer__bottom">
        <span>{FOOTER_DATA.bottom.copyright}</span>

        <div className="footer-bottom-links">
          {FOOTER_DATA.bottom.links.map(link => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
