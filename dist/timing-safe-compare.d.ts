/**
 * Compara duas strings em tempo constante (hasheando antes, já que
 * timingSafeEqual exige buffers do mesmo tamanho). Use para comparar
 * segredos/códigos vindos do usuário contra um valor esperado — nunca `===`.
 */
export declare function timingSafeStringEqual(a: string, b: string): boolean;
