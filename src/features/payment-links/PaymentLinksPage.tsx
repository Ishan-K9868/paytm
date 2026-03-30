import { Copy, QrCode, Send, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AmountDisplay } from '@/components/AmountDisplay';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageIntro } from '@/features/shared/PageIntro';
import { usePaymentLinks } from '@/features/payment-links/usePaymentLinks';

export function PaymentLinksPage() {
  const { links, createLink, cancelLink } = usePaymentLinks();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('Advance payment');
  const [amount, setAmount] = useState('1250');
  const [customerName, setCustomerName] = useState('');
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stats = useMemo(() => ({
    active: links.filter((link) => link.status === 'active').length,
    collected: links.filter((link) => link.status === 'paid').reduce((sum, item) => sum + item.amount, 0),
    expired: links.filter((link) => link.status === 'expired').length,
  }), [links]);

  const handleCopy = async (linkUrl: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopiedId(linkId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = linkUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(linkId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleShare = (linkUrl: string, description: string, amount: number) => {
    const message = `Hi! Please pay ₹${amount.toFixed(2)} for "${description}" using this link: ${linkUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <PageIntro actions={<Button onClick={() => setIsOpen(true)} type="button">+ Create Link</Button>} label="Payments" subtitle="Generate a payment request, then immediately share it across the customer's preferred channel." title="Payment Links">
      <div className="recon-summary-grid">
        <Card accent="cyan" className="recon-summary-card"><div className="stat-label">Active Links</div><div className="stat-value">{stats.active}</div></Card>
        <Card accent="success" className="recon-summary-card"><div className="stat-label">Collected</div><div className="stat-value"><AmountDisplay amount={stats.collected} size="xl" /></div></Card>
        <Card accent="warning" className="recon-summary-card"><div className="stat-label">Expired</div><div className="stat-value">{stats.expired}</div></Card>
      </div>

      <div className="recon-table-wrapper">
        <div className="recon-table-head payment-links-head"><span>Amount</span><span>Description</span><span>Customer</span><span>Created</span><span>Expires</span><span>Status</span><span>Actions</span></div>
        {links.map((link) => (
          <div className="payment-link-row" key={link.id}>
            <span className="amount-cell">Rs. {link.amount.toFixed(2)}</span>
            <span>{link.description}</span>
            <span>{link.customerName ?? '-'}</span>
            <span>{link.createdAt}</span>
            <span>{link.expiryDate ?? '-'}</span>
            <span className={`link-status ${link.status}`}>{link.status}</span>
            <span className="link-actions">
              <button 
                className={`result-action-btn ${copiedId === link.id ? 'copied' : ''}`} 
                onClick={() => handleCopy(link.linkUrl, link.id)} 
                title="Copy link"
                type="button"
              >
                {copiedId === link.id ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button 
                className="result-action-btn" 
                onClick={() => handleShare(link.linkUrl, link.description, link.amount)} 
                title="Share via WhatsApp"
                type="button"
              >
                <Send size={14} />
              </button>
              {link.status === 'active' ? (
                <button className="result-action-btn cancel-btn" onClick={() => cancelLink(link.id)} title="Cancel link" type="button">Cancel</button>
              ) : null}
            </span>
          </div>
        ))}
      </div>

      {isOpen ? (
        <div className="create-link-modal">
          <div className="create-link-panel">
            <div className="dashboard-panel-header"><h2 className="modal-title">Create payment link</h2><button className="modal-close" onClick={() => setIsOpen(false)} type="button">Close</button></div>
            <div className="auth-form-grid">
              <label><span className="auth-label">Amount</span><Input className="input" onChange={(event) => setAmount(event.target.value)} value={amount} /></label>
              <label><span className="auth-label">Description</span><Input className="input" onChange={(event) => setDescription(event.target.value)} value={description} /></label>
              <label><span className="auth-label">Customer name</span><Input className="input" onChange={(event) => setCustomerName(event.target.value)} value={customerName} /></label>
              <Button onClick={async () => {
                const next = await createLink({ amount: Number(amount), description, customerName, expiryLabel: '3 Apr 2026' });
                setCreatedLink(next.linkUrl);
              }} type="button">Create Link</Button>
            </div>
            {createdLink ? (
              <div className="share-panel">
                <div className="link-url">{createdLink}</div>
                <div className="share-actions">
                  <Button onClick={() => handleCopy(createdLink, 'new')} type="button"><Copy size={14} />Copy link</Button>
                  <Button onClick={() => handleShare(createdLink, description, Number(amount))} type="button" variant="secondary"><Send size={14} />WhatsApp</Button>
                  <Button type="button" variant="secondary"><QrCode size={14} />QR Code</Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </PageIntro>
  );
}
