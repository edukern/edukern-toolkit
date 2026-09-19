export type BrAddress = {
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
};
/**
 * Busca endereço por CEP via ViaCEP (gratuito, sem chave). Retorna `null`
 * quando o CEP tem formato válido mas não existe na base dos Correios —
 * isso não é erro de rede, então não lança (deixa o chamador decidir o que
 * mostrar, ex. "CEP não encontrado" vs. erro de conexão).
 */
export declare function fetchAddressByCep(cep: string): Promise<BrAddress | null>;
