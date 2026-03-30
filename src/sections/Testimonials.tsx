import { motion } from 'motion/react';
import { BorderReveal } from '../components/BorderReveal';

const TESTIMONIALS = [
  { name: 'Priya Sharma', business: 'Boutique Owner · Jaipur', initials: 'PS', avatarColor: '#DB2777', rating: 5, quote: 'Mere customers jo kehte the payment done aur soundbox beep nahi karta - ab main instantly verify kar leti hoon. Bahut peace of mind hai.', metric: 'Zero double-payment incidents in 3 months' },
  { name: 'Suresh Mehta', business: 'Auto Parts · Pune', initials: 'SM', avatarColor: '#7C3AED', rating: 5, quote: 'Dispute wala feature best hai. Pehle I did not even know I could respond to chargebacks. PayAssist ne draft karke diya - I just approved it.', metric: '₹8,400 recovered in disputes this month' },
  { name: 'Anita Verma', business: 'Restaurant · Delhi', initials: 'AV', avatarColor: '#059669', rating: 5, quote: 'Voice feature mein Hindi mein poochhti hoon. English mein bhi chalata hai. Mere staff ke liye easy hai - unhe kuch sikhana nahi pada.', metric: 'Used 4-5 times daily by 3 staff members' },
  { name: 'Vikram Nair', business: 'Electronics Shop · Kochi', initials: 'VN', avatarColor: '#0891B2', rating: 4, quote: 'Settlement report automatically match hota hai. Pehle Excel mein manually likhta tha. Abhi raat ko sirf PDF download karta hoon - done.', metric: '90 minutes saved per week on reconciliation' },
  { name: 'Meena Devi', business: 'Saree Store · Varanasi', initials: 'MD', avatarColor: '#D97706', rating: 5, quote: 'Bahut simple hai. Seedha phone pe sab kuch dikhta hai. Mujhe koi training nahi chahiye thi.', metric: 'Set up in 8 minutes, no training needed' },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="checkered-navy" style={{ padding: '120px 0' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <BorderReveal dark />
        <blockquote style={{ borderLeft: '4px solid var(--cyan)', paddingLeft: '32px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-8px', top: '-26px', fontSize: '120px', color: 'rgba(0, 46, 110, 0.8)', opacity: 0.25, lineHeight: 1 }}>❝</div>
          <p className="display-lg" style={{ color: 'white', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
            Pehle raat ko ghar jaane se pehle 45 minute lagta tha hisaab karne mein. Ab sirf ek button press karta hoon. PayAssist bata deta hai ki sab clear hai.
          </p>
          <footer style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--navy)', fontSize: 18 }}>RK</div>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: 16 }}>Ramesh Kumar</div>
              <div style={{ color: 'var(--text-on-dark-muted)', fontSize: 13 }}>Kirana Shop Owner · Lucknow, UP</div>
            </div>
            <div style={{ marginLeft: 'auto', color: 'var(--amber)', fontSize: '18px' }}>★★★★★</div>
          </footer>
        </blockquote>

        <div style={{ columnCount: 1, columnGap: '20px', marginTop: '40px' }} className="lg:[column-count:3]">
          {TESTIMONIALS.map((item, index) => (
            <motion.article key={item.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: index * 0.06 }} style={{ breakInside: 'avoid', display: 'inline-block', width: '100%', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '22px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: item.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{item.initials}</div>
                <div>
                  <div style={{ color: 'white', fontWeight: 700 }}>{item.name}</div>
                  <div style={{ color: 'var(--text-on-dark-muted)', fontSize: '12px' }}>{item.business}</div>
                </div>
              </div>
              <div style={{ color: 'var(--amber)', fontSize: '16px', marginTop: '14px' }}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</div>
              <p style={{ color: 'white', fontSize: '15px', marginTop: '12px', lineHeight: 1.75 }}>{item.quote}</p>
              <div style={{ display: 'inline-flex', marginTop: '16px', borderRadius: '999px', background: 'rgba(0,185,241,0.1)', color: 'var(--cyan)', padding: '8px 12px', fontSize: '12px', fontWeight: 700 }}>{item.metric}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
