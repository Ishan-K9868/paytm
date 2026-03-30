import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BorderReveal } from '../components/BorderReveal';

const VOICE_QUERIES = [
  { hindi: 'Aaj ka settlement kyon kam hai?', english: "Why is today's settlement less?" },
  { hindi: 'Kya ₹450 wala payment aaya?', english: 'Did the ₹450 payment arrive?' },
  { hindi: 'Mera dispute kab resolve hoga?', english: 'When will my dispute resolve?' },
  { hindi: 'Aaj kitna collected hua?', english: 'How much was collected today?' },
  { hindi: 'Refund kab tak aayega customer ko?', english: 'When will customer get refund?' },
  { hindi: 'Kaunsa payment method best hai mere liye?', english: 'Which payment method is best for me?' },
];

const RESPONSES: Record<string, string> = {
  settlement: 'Aapke aaj ke settlement aur collection mein ₹340 ka farq hai. Yeh farq ₹200 ke ek UPI reversal aur ₹140 ke MDR deduction ki wajah se hai. Koi missing payment nahi hai - sab clear hai.',
  payment: '₹450 wala payment 3:08 PM par receive hua tha. Transaction verified hai aur settlement next business cycle mein reflect hoga.',
  dispute: 'Aapka dispute abhi reviewing stage mein hai. Required documents already attached hain. Expected update 2 working days ke andar aa jayega.',
  collected: 'Aaj total ₹12,400 collect hua hai. Ismein 68% UPI, 22% card aur 10% payment links se aaya hai.',
  refund: 'Refund bank acknowledgement stage mein hai. Customer ko credit 24-48 hours ke andar mil jana chahiye.',
  method: 'Aapke business ke liye UPI sabse healthy rail hai. Success rate 98.2% hai aur zero MDR ka benefit bhi mil raha hai.',
};

function getResponse(question: string) {
  const value = question.toLowerCase();
  if (value.includes('settlement')) return RESPONSES.settlement;
  if (value.includes('₹450') || value.includes('payment')) return RESPONSES.payment;
  if (value.includes('dispute')) return RESPONSES.dispute;
  if (value.includes('collected')) return RESPONSES.collected;
  if (value.includes('refund')) return RESPONSES.refund;
  return RESPONSES.method;
}

export function Voice() {
  const [query, setQuery] = useState('');
  const [activeResponse, setActiveResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const actions = useMemo(() => ['View full explanation', 'Export summary', 'Create reminder'], []);

  const runVoice = (question: string) => {
    setQuery(question);
    setIsListening(true);
    setActiveResponse('');
    window.setTimeout(() => {
      setIsListening(false);
      setIsThinking(true);
    }, 900);
    window.setTimeout(() => {
      setIsThinking(false);
      setActiveResponse(getResponse(question));
    }, 1700);
  };

  return (
    <section id="voice" style={{ minHeight: '100vh', padding: '120px 0', background: 'linear-gradient(135deg, #001A42 0%, #002E6E 60%, #003D8F 100%)' }}>
      <div className="container">
        <BorderReveal dark />
        <div style={{ textAlign: 'center', maxWidth: '980px', margin: '0 auto' }}>
          <h2 className="display-lg" style={{ color: 'white', marginBottom: '12px' }}>
            Just ask.<br />
            <em style={{ color: 'var(--cyan)' }}>In any language.</em>
          </h2>
          <p className="body-lg" style={{ color: 'var(--text-on-dark-muted)', maxWidth: '480px', margin: '0 auto 40px' }}>
            Hindi. English. Hinglish. PayAssist understands how merchants actually talk - not how finance textbooks write.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => runVoice(query || VOICE_QUERIES[0].hindi)}
            animate={isListening ? { boxShadow: ['0 0 0 0 rgba(0, 185, 241, 0.4)', '0 0 0 24px rgba(0, 185, 241, 0)'] } : {}}
            transition={{ duration: 1.2, repeat: isListening ? Infinity : 0 }}
            style={{ width: '120px', height: '120px', borderRadius: '50%', background: isListening ? 'var(--cyan)' : 'rgba(0, 185, 241, 0.15)', border: '2px solid rgba(0, 185, 241, 0.4)', cursor: 'pointer', fontSize: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', position: 'relative', color: isListening ? 'var(--navy)' : 'white' }}
          >
            🎙
          </motion.button>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '16px' }}>{isListening ? 'Listening...' : 'Click to ask a question'}</p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '28px' }}>
            {VOICE_QUERIES.map((item) => (
              <button key={item.hindi} onClick={() => runVoice(item.hindi)} title={item.english} style={{ borderRadius: '999px', border: '1px solid rgba(0,185,241,0.32)', background: 'rgba(0,185,241,0.15)', color: 'white', padding: '10px 14px', cursor: 'pointer' }}>
                {item.hindi}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: '680px', margin: '24px auto 0' }}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && runVoice(query)} placeholder="Type your own question" style={{ width: '100%', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.08)', color: 'white', padding: '16px 18px' }} />

            <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,185,241,0.28)', borderRadius: '22px', padding: '22px', textAlign: 'left', minHeight: '180px' }}>
              <div style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 700, letterSpacing: '0.08em' }}>PAYASSIST SAYS</div>
              <AnimatePresence mode="wait">
                {isThinking ? (
                  <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    {[0, 1, 2].map((index) => <motion.div key={index} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.1 }} style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--cyan)' }} />)}
                  </motion.div>
                ) : (
                  <motion.div key={activeResponse || 'empty'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p style={{ color: 'white', fontSize: '15px', lineHeight: 1.8, marginTop: '14px' }}>{activeResponse || 'Choose a merchant question to watch PayAssist answer it in plain language.'}</p>
                    {activeResponse && <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>{actions.map((action, index) => <motion.button key={action} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * index }} style={{ borderRadius: '999px', border: '1px solid rgba(255,255,255,0.16)', background: 'transparent', color: 'white', padding: '10px 14px', cursor: 'pointer' }}>{action}</motion.button>)}</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
