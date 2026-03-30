import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PageIntro } from '@/features/shared/PageIntro';
import { VerifyForm } from '@/features/verifier/VerifyForm';
import { VerifyResult } from '@/features/verifier/VerifyResult';
import { useVerification } from '@/features/verifier/useVerification';

export function VerifierPage() {
  const [orderId, setOrderId] = useState('PAY2024032991234');
  const [txnAmount, setTxnAmount] = useState('');
  const { state, result, error, verify, reset, recentItems } = useVerification();

  return (
    <PageIntro
      label="Payments"
      title="Verify Payment"
      subtitle="Check any order in seconds, confirm whether the money landed, and see what to do next without switching apps."
      actions={<><Button onClick={() => reset()} type="button" variant="secondary">Clear</Button></>}
    >
      <div className="verify-layout">
        <VerifyForm
          onVerify={() => void verify({ orderId, txnAmount })}
          orderId={orderId}
          recentItems={recentItems}
          setOrderId={setOrderId}
          setTxnAmount={setTxnAmount}
          txnAmount={txnAmount}
        />
        <VerifyResult error={error} orderId={orderId} result={result} state={state} />
      </div>
    </PageIntro>
  );
}
