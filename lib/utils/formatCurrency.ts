export function formatCurrency(amount: number): string {
  return `Rs ${amount.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}