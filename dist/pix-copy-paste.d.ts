export type PixCharge = {
    pixKey: string;
    merchantName: string;
    merchantCity: string;
    amount?: number;
    txid?: string;
};
/**
 * Monta o "Pix copia e cola" (payload EMV/BR Code estático do Bacen) sem
 * nenhuma API de pagamento — quem recebe cola no app do banco e paga na hora.
 * `merchantName`/`merchantCity` são truncados em 25/15 caracteres porque esse
 * é o limite do campo no formato EMV, não uma escolha arbitrária. `txid`
 * default `"***"` (sem identificador de cobrança específico) é o valor que o
 * manual do Bacen exige quando não há um id de transação a rastrear.
 */
export declare function buildPixCopyPaste(charge: PixCharge): string;
