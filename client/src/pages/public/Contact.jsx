import { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No backend endpoint exists yet for support tickets — see PROGRESS.md.
    // We show a calm confirmation rather than silently pretending to send it.
    setSent(true);
  }

  return (
    <PageLayout>
      <div className="max-w-container mx-auto px-xl py-3xl max-w-xl">
        <h1 className="text-[32px] font-bold text-text-primary mb-sm">Contact Kaalmo</h1>
        <p className="text-[15px] text-text-secondary mb-2xl">
          Have a question about a campaign, a donation, or your account? Send us a message.
        </p>

        {sent ? (
          <div className="bg-success/10 border border-success/30 rounded-lg p-xl flex items-center gap-md">
            <span className="material-symbols-outlined text-success">check_circle</span>
            <div>
              <p className="text-[15px] font-medium text-text-primary">Message received</p>
              <p className="text-[13px] text-text-secondary">Our support team will reply by email within 1–2 business days.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            <Input label="Your name" id="name" required />
            <Input label="Email address" id="email" type="email" required />
            <div className="flex flex-col gap-sm">
              <label htmlFor="message" className="text-[14px] font-medium text-text-primary">
                How can we help?
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="w-full px-lg py-md rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary transition-colors"
              />
            </div>
            <Button type="submit" className="self-start">Send message</Button>
          </form>
        )}
      </div>
    </PageLayout>
  );
}
