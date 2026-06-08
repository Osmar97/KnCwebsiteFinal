import { Reveal } from "@/components/tour/Reveal";
import InlineTourForm from "@/components/tour/InlineTourForm";

type T = (path: string) => any;

interface Props {
  variant: "private" | "waitlist";
  isSubmitting: boolean;
  submitted: boolean;
  onSubmit: (payload: Record<string, unknown>) => Promise<void> | void;
  t: T;
}

export function PrivateTourSection({ variant, isSubmitting, submitted, onSubmit, t }: Props) {
  return (
    <section className="form-section" id="private">
      <div className="t-container">
        <div className="section-eyebrow">{t("private_section.eyebrow")}</div>
        <h2 className="section-title">{t("private_section.title_1")}<br /><em>{t("private_section.title_2")}</em></h2>
        <p className="section-desc">{t("private_section.desc")}</p>
        <Reveal>
          <InlineTourForm
            variant={variant}
            isSubmitting={isSubmitting}
            submitted={submitted}
            onSubmit={onSubmit}
            t={t}
          />
        </Reveal>
      </div>
    </section>
  );
}

export function WaitlistSection({ variant, isSubmitting, submitted, onSubmit, t }: Props) {
  return (
    <section className="form-section dark" id="waitlist">
      <div className="t-container">
        <div className="section-eyebrow">{t("waitlist_section.eyebrow")}</div>
        <h2 className="section-title">{t("waitlist_section.title_1")}<br /><em>{t("waitlist_section.title_2")}</em></h2>
        <p className="section-desc">{t("waitlist_section.desc")}</p>
        <Reveal>
          <InlineTourForm
            variant={variant}
            isSubmitting={isSubmitting}
            submitted={submitted}
            onSubmit={onSubmit}
            t={t}
          />
        </Reveal>
      </div>
    </section>
  );
}