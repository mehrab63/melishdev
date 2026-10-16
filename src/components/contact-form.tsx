"use client";
import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import type { SiteContent } from "@/content";
export function ContactForm({
  copy,
  email,
}: {
  copy: SiteContent["contact"];
  email?: string;
}) {
  const [opened, setOpened] = useState(false);
  return (
    <form
      action={email ? "mailto:" + email : "mailto:"}
      method="post"
      encType="text/plain"
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        const data = new FormData(e.currentTarget);
        const subject = "Melish.dev · " + String(data.get("interest"));
        const body =
          String(data.get("message")) +
          "\n\n" +
          String(data.get("name")) +
          "\n" +
          String(data.get("email"));
        window.location.href =
          "mailto:" +
          email +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(body);
        setOpened(true);
      }}
    >
      <Mail size={24} className="accent-icon" aria-hidden="true" />
      <h2>{copy.formTitle}</h2>
      <p>{copy.formText}</p>
      <div className="form-row">
        <label>
          {copy.name}
          <input
            name="name"
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            required
            maxLength={120}
          />
        </label>
        <label>
          {copy.email}
          <input
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            required
            maxLength={254}
          />
        </label>
      </div>
      <label>
        {copy.interest}
        <select name="interest">
          <option>{copy.consulting}</option>
          <option>{copy.hiring}</option>
        </select>
      </label>
      <label>
        {copy.message}
        <textarea
          name="message"
          rows={5}
          placeholder={copy.messagePlaceholder}
          minLength={15}
          maxLength={5000}
          required
        />
      </label>
      <button
        type="submit"
        className="button"
        disabled={!email}
        aria-describedby="contact-notice"
      >
        {copy.submit}
        <ArrowRight size={18} className="directional" aria-hidden="true" />
      </button>
      <p
        id="contact-notice"
        className="form-notice"
        role={opened ? "status" : undefined}
      >
        {email ? copy.hint : copy.pending}
      </p>
    </form>
  );
}
