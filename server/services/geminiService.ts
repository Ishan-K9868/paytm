const systemContext = `
You are PayAssist - an AI copilot for Indian small business merchants using Paytm.
You must be clear, concise, and grounded in known facts.
`;

export async function explainTransaction(input: { orderId: string; status: string; amount: string }) {
  return `${systemContext.trim()} Demo explanation: Order ${input.orderId} is ${input.status} for Rs. ${input.amount}.`;
}
