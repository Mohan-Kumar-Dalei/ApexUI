import { useState } from "react";
import { Container, Lines, Reveal, UNDERLINE } from "../lib/ui.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Client-side only: nothing is sent anywhere until a mailing list provider is connected.
function RoastNotes() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter an email like name@example.com.");
      setStatus("error");
      return;
    }
    setError("");
    setStatus("done");
  };

  if (status === "done") {
    return <p className="text-lg text-[var(--k-bg)]">Thanks. The next roast note will come to this address.</p>;
  }

  return (
    <form noValidate onSubmit={submit} className="max-w-xl">
      <label htmlFor="roast-email" className="block text-sm text-[var(--k-soft)]">
        Roast notes. One email when a new roast lands, never more than two a month.
      </label>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="roast-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={120}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "roast-email-error" : undefined}
          className="min-w-0 flex-1 border-b border-[var(--k-soft)] bg-transparent py-3 text-[16px] text-[var(--k-bg)] outline-none placeholder:text-[var(--k-soft)] focus-visible:border-[var(--k-bg)]"
        />
        <button type="submit" className="h-12 bg-[var(--k-bg)] px-7 text-[15px] text-[var(--k-ink)] transition-colors duration-300 hover:bg-[var(--k-surface)]">
          Subscribe
        </button>
      </div>
      {status === "error" && (
        <p id="roast-email-error" role="alert" className="mt-3 text-sm text-[var(--k-soft)]">
          {error}
        </p>
      )}
    </form>
  );
}

export default function Closing() {
  return (
    <section className="bg-[var(--k-ink)] text-[var(--k-bg)]">
      <Container className="py-24 sm:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <Lines
            as="h2"
            text="Start with one bag, or come in for a cup."
            className="font-display text-[40px] leading-[1.02] sm:text-[56px] lg:col-span-8 lg:text-[80px]"
          />
          <Reveal className="flex flex-wrap items-center gap-x-8 gap-y-5 lg:col-span-4 lg:justify-end">
            <a href="#beans" className="inline-flex h-12 items-center bg-[var(--k-bg)] px-7 text-[15px] text-[var(--k-ink)] transition-colors duration-300 hover:bg-[var(--k-surface)]">
              Shop beans
            </a>
            <a href="#visit" className={`${UNDERLINE} text-[15px] text-[var(--k-bg)]`}>
              Visit the bar
            </a>
          </Reveal>
        </div>

        <div className="mt-16 border-t border-[var(--k-night-line)] pt-10">
          <RoastNotes />
        </div>
      </Container>
    </section>
  );
}
