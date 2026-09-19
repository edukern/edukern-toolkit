/**
 * Busca endereço por CEP via ViaCEP (gratuito, sem chave). Retorna `null`
 * quando o CEP tem formato válido mas não existe na base dos Correios —
 * isso não é erro de rede, então não lança (deixa o chamador decidir o que
 * mostrar, ex. "CEP não encontrado" vs. erro de conexão).
 */
export async function fetchAddressByCep(cep) {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8)
        throw new Error("fetchAddressByCep() exige CEP com 8 dígitos");
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!response.ok)
        throw new Error(`ViaCEP respondeu ${response.status}`);
    const data = (await response.json());
    if (data.erro)
        return null;
    return {
        cep: data.cep,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
    };
}
