import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MessageSquare, X } from 'lucide-react';
import { toast } from 'sonner';

const ACCESS_KEY = '17a68c11-3e40-4879-ba02-65457533f959';

const field =
    'w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--fg-subtle)] transition focus:border-[var(--border-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]';

export default function FeedbackButton() {
    const [open, setOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const formRef = useRef(null);

    const submit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);
        const data = new FormData(formRef.current);
        data.append('access_key', ACCESS_KEY);
        data.append('subject', 'New Feedback from ApexUI');
        try {
            const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
            if (!res.ok) throw new Error('Request failed');
            toast.success('Thanks! Your feedback was sent.');
            formRef.current?.reset();
            setOpen(false);
        } catch {
            toast.error('Could not send feedback. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-5 z-[900] inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--fg)] shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--surface-2)]"
            >
                <MessageSquare className="h-4 w-4 text-[var(--accent-text)]" />
                Feedback
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
                    >
                        <motion.div
                            role="dialog"
                            aria-label="Send feedback"
                            className="relative w-full max-w-sm rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-2xl"
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--fg-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <h2 className="text-base font-semibold text-[var(--fg)]">Share your feedback</h2>
                            <p className="mt-1 text-sm text-[var(--fg-muted)]">Found a bug or want a component? Let us know.</p>
                            <form ref={formRef} onSubmit={submit} className="mt-5 space-y-3">
                                <input type="email" name="email" required placeholder="you@example.com" className={field} />
                                <textarea name="message" required rows={4} placeholder="What could be better?" className={`${field} resize-none`} />
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--fg)] text-sm font-medium text-[var(--bg)] transition hover:opacity-90 disabled:opacity-60"
                                >
                                    {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {sending ? 'Sending…' : 'Send feedback'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
