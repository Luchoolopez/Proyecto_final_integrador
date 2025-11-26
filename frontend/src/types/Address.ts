export interface Address {
    id: number;
    usuario_id: number;
    calle: string;
    numero: string;
    piso?: string;
    dpto?: string;
    ciudad: string;
    provincia: string;
    codigo_postal: string;
    pais: string;
    es_principal: boolean;
}