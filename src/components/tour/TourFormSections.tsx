import { Reveal } from "@/components/tour/Reveal";
import InlineTourForm from "@/components/tour/InlineTourForm";

interface Props {
  variant: "private" | "waitlist";
  isSubmitting: boolean;
  submitted: boolean;
  onSubmit: (payload: unknown) => void;
}

export function PrivateTourSection({ variant, isSubmitting, submitted, onSubmit }: Props) {
  return (
    <section className="form-section" id="private">
      <div className="t-container">
        <div className="section-eyebrow">Private Tour</div>
        <h2 className="section-title">Design your<br /><em>experience</em></h2>
        <p className="section-desc">
          Tell us what you're looking for. We'll review your submission and send a tailored quote within 48 hours, along with availability for your first consultation call.
        </p>
        <Reveal>
          {/* @ts-expect-error existing InlineTourForm typing */}
          <InlineTourForm
            variant={variant}
            isSubmitting={isSubmitting}
            submitted={submitted}
            onSubmit={onSubmit}
          />
        </Reveal>
      </div>
    </section>
  );
}

export function WaitlistSection({ variant, isSubmitting, submitted, onSubmit }: Props) {
  return (
    <section className="form-section dark" id="waitlist">
      <div className="t-container">
        <div className="section-eyebrow">Join the Waitlist</div>
        <h2 className="section-title">Tell us where<br /><em>you want to go</em></h2>
        <p className="section-desc">
          Whether you're joining a group trip or considering a private tour, this form gives us everything we need to find the right experience for you. We'll be in touch within 5 business days.
        </p>
        <Reveal>
          {/* @ts-expect-error existing InlineTourForm typing */}
          <InlineTourForm
            variant={variant}
            isSubmitting={isSubmitting}
            submitted={submitted}
            onSubmit={onSubmit}
          />
        </Reveal>
      </div>
    </section>
  );
}