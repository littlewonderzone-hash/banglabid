import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Loader from "../components/Loader";

export default function UpgradePayment() {
  const token = localStorage.getItem("banglabid_student_token");
  const navigate = useNavigate();
  const [bkashSender, setBkashSender] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyBkashNumber() {
    navigator.clipboard
      .writeText("01710176301")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Link to="/student/login" className="rounded-xl bg-[var(--color-ink)] px-6 py-3 font-display font-bold text-white">
          স্টুডেন্ট লগইন করুন
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-display text-2xl font-bold text-[var(--color-greenpen)]">পেমেন্ট জমা হয়েছে ✓</p>
        <p className="mt-2 text-sm text-[var(--color-text)]/70">
          পেমেন্ট যাচাইয়ের পর অ্যাডমিন আপনার অ্যাকাউন্ট Pro করে দেবেন — কনফার্ম হলেই সব পরীক্ষা
          আনলক হয়ে যাবে।
        </p>
        <Link to="/student" className="mt-6 inline-block rounded-xl bg-[var(--color-ink)] px-6 py-3 font-display font-bold text-white">
          পোর্টালে ফিরুন
        </Link>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    if (!bkashSender || !transactionId) {
      setError("বিকাশ নম্বর ও ট্রানজেকশন আইডি দিন।");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await api.submitUpgradePayment(token, bkashSender, transactionId);
      if (res.ok) {
        setDone(true);
      } else {
        setError(res.message || "জমা দেওয়া যায়নি।");
      }
    } catch {
      setError("সার্ভারের সাথে সংযোগ করা যায়নি।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-[var(--color-ink)]">কোর্স কিনুন — Pro আনলক করুন</h1>
      <p className="mt-1 text-sm text-[var(--color-text)]/70">
        পেমেন্ট করলে অনুধাবনমূলক পরীক্ষা, বানান প্রতিযোগিতা, লাইভ পরীক্ষা ও আনলিমিটেড মক টেস্ট আনলক
        হয়ে যাবে — নতুন করে রেজিস্ট্রেশন করার দরকার নেই।
      </p>

      <div className="mt-6 rounded-xl border border-[var(--color-marigold)]/40 bg-[var(--color-marigold)]/10 p-4 text-sm leading-relaxed">
        নিচের বিকাশ নম্বরে{" "}
        <span className="inline-flex items-center gap-2 align-middle">
          <span className="font-display text-base font-bold text-[var(--color-ink)]">01710176301</span>
          <button
            type="button"
            onClick={copyBkashNumber}
            title="নম্বর কপি করুন"
            className="rounded-md border border-[var(--color-ink)]/30 bg-white px-2 py-0.5 text-xs font-bold text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
          >
            {copied ? "কপি হয়েছে ✓" : "কপি করুন"}
          </button>
        </span>{" "}
        নির্দিষ্ট পরিমাণ টাকা <b>Send Money</b> করুন, তারপর যে নম্বর থেকে টাকা পাঠিয়েছেন সেটি ও
        ট্রানজেকশন আইডি নিচে লিখে জমা দিন।
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-[var(--color-redpen)]/10 px-4 py-2 text-sm font-medium text-[var(--color-redpen)]">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="mt-4 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--color-ink)]">
            আপনার বিকাশ নম্বর (যেটি থেকে টাকা পাঠিয়েছেন)
          </span>
          <input
            className="input"
            required
            value={bkashSender}
            onChange={(e) => setBkashSender(e.target.value.replace(/[^0-9]/g, "").slice(0, 11))}
            placeholder="০১XXXXXXXXX"
            inputMode="numeric"
            maxLength={11}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--color-ink)]">ট্রানজেকশন আইডি (Transaction ID)</span>
          <input className="input" required value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="যেমনঃ 9F7A2XYZ1" />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[var(--color-redpen)] px-6 py-3 font-display text-base font-bold text-white disabled:opacity-60"
        >
          {submitting ? "জমা হচ্ছে…" : "পেমেন্ট তথ্য জমা দিন"}
        </button>
        {submitting && <Loader />}
      </form>
    </div>
  );
}