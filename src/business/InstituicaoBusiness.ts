import { InstituicaoDatabase } from "../data/InstituicaoDatabase";
import { CreateInstituicaoInputDTO, UpdateInstituicaoInputDTO, INSTITUICAO_TIPO } from "../model/Instituicao";
import { IdGenerator } from "../services/IdGenerator";

export class InstituicaoBusiness {
    constructor(
        private instituicaoDatabase: InstituicaoDatabase,
        private idGenerator: IdGenerator
    ) { }

    public getAll = async (queryParams: any) => {
        return this.instituicaoDatabase.find(queryParams);
    }

    public create = async (input: CreateInstituicaoInputDTO) => {
        const { nome, tipo, ativo } = input;

        if (!nome) {
            throw new Error("Nome da instituição é obrigatório");
        }

        if (tipo && !Object.values(INSTITUICAO_TIPO).includes(tipo)) {
            throw new Error("Tipo de instituição inválido");
        }

        const uuid = this.idGenerator.generate();

        const instituicao = {
            uuid,
            nome,
            tipo: tipo || INSTITUICAO_TIPO.PRODUCAO,
            ativo: ativo !== undefined ? ativo : true,
            created_at: new Date(),
            updated_at: new Date()
        };

        await this.instituicaoDatabase.create(instituicao);

        return instituicao;
    }

    public update = async (id: string, input: UpdateInstituicaoInputDTO) => {
        const { nome, tipo, ativo } = input;

        const instituicao = await this.instituicaoDatabase.findByUuid(id);

        if (!instituicao) {
            throw new Error("Instituição não encontrada");
        }

        if (tipo && !Object.values(INSTITUICAO_TIPO).includes(tipo)) {
            throw new Error("Tipo de instituição inválido");
        }

        const updatedInstituicao = {
            nome: nome || instituicao.nome,
            tipo: tipo || instituicao.tipo,
            ativo: ativo !== undefined ? ativo : instituicao.ativo,
            updated_at: new Date()
        };

        await this.instituicaoDatabase.updateByUuid(id, updatedInstituicao);

        return { ...instituicao, ...updatedInstituicao };
    }

    public delete = async (id: string) => {
        const instituicao = await this.instituicaoDatabase.findByUuid(id);

        if (!instituicao) {
            throw new Error("Instituição não encontrada");
        }

        await this.instituicaoDatabase.deleteByUuid(id);
    }
}
