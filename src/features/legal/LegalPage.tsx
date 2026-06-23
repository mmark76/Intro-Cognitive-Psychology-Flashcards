import type { LegalPageContent } from "./legalPages";
import "./legal.css";

type LegalPageProps = {
  content: LegalPageContent;
};

export function LegalPage({ content }: LegalPageProps) {
  return (
    <article className="legal-page stack-lg">
      <header className="page-heading">
        <p className="eyebrow">Legal information</p>
        <h2>{content.title}</h2>
        <p>{content.summary}</p>
        <p className="legal-updated">Last updated: {content.lastUpdated}</p>
      </header>

      <div className="legal-content">
        {content.sections.map((section) => (
          <section className="content-panel legal-section" key={section.heading}>
            <h3>{section.heading}</h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
