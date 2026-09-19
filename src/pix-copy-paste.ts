function crc16Ccitt(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tlv(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

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
export function buildPixCopyPaste(charge: PixCharge): string {
  const { pixKey, merchantName, merchantCity, amount, txid = "***" } = charge;
  if (!pixKey) throw new Error("buildPixCopyPaste() exige pixKey");
  if (!merchantName) throw new Error("buildPixCopyPaste() exige merchantName");
  if (!merchantCity) throw new Error("buildPixCopyPaste() exige merchantCity");

  const merchantAccountInfo = tlv("00", "BR.GOV.BCB.PIX") + tlv("01", pixKey);

  const withoutCrc =
    tlv("00", "01") +
    tlv("01", "11") +
    tlv("26", merchantAccountInfo) +
    tlv("52", "0000") +
    tlv("53", "986") +
    (amount != null ? tlv("54", amount.toFixed(2)) : "") +
    tlv("58", "BR") +
    tlv("59", merchantName.slice(0, 25)) +
    tlv("60", merchantCity.slice(0, 15)) +
    tlv("62", tlv("05", txid)) +
    "6304";

  return withoutCrc + crc16Ccitt(withoutCrc);
}
