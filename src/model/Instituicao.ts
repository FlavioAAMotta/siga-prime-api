export enum INSTITUICAO_TIPO {
    PRODUCAO = "producao",
    TESTE = "teste"
}

export interface Instituicao {
    id: number;
    uuid: string;
    nome: string;
    tipo: INSTITUICAO_TIPO;
    ativo: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateInstituicaoInputDTO {
    nome: string;
    tipo?: INSTITUICAO_TIPO;
    ativo?: boolean;
}

export interface UpdateInstituicaoInputDTO {
    nome?: string;
    tipo?: INSTITUICAO_TIPO;
    ativo?: boolean;
}
