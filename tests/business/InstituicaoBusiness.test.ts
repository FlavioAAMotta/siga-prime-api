import { InstituicaoBusiness } from "../../src/business/InstituicaoBusiness";
import { InstituicaoDatabase } from "../../src/data/InstituicaoDatabase";
import { IdGenerator } from "../../src/services/IdGenerator";
import { INSTITUICAO_TIPO } from "../../src/model/Instituicao";

describe("InstituicaoBusiness", () => {
    let instituicaoBusiness: InstituicaoBusiness;
    let instituicaoDatabaseMock: any;
    let idGeneratorMock: any;

    beforeEach(() => {
        instituicaoDatabaseMock = {
            find: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn()
        };

        idGeneratorMock = {
            generate: jest.fn().mockReturnValue("id-mock")
        };

        instituicaoBusiness = new InstituicaoBusiness(
            instituicaoDatabaseMock as unknown as InstituicaoDatabase,
            idGeneratorMock as unknown as IdGenerator
        );
    });

    test("GetAll should return list of instituicoes", async () => {
        const mockResult = [{ id: "1", nome: "Test" }];
        instituicaoDatabaseMock.find.mockResolvedValue(mockResult);

        const result = await instituicaoBusiness.getAll({});

        expect(instituicaoDatabaseMock.find).toHaveBeenCalled();
        expect(result).toEqual(mockResult);
    });

    test("Create should fail if nome is missing", async () => {
        const input = { nome: "" };
        await expect(instituicaoBusiness.create(input)).rejects.toThrow("Nome da instituição é obrigatório");
    });

    test("Create should fail with invalid type", async () => {
        const input = { nome: "Test", tipo: "invalid" as any };
        await expect(instituicaoBusiness.create(input)).rejects.toThrow("Tipo de instituição inválido");
    });

    test("Create should success", async () => {
        const input = { nome: "Test", tipo: INSTITUICAO_TIPO.PRODUCAO };
        await instituicaoBusiness.create(input);

        expect(idGeneratorMock.generate).toHaveBeenCalled();
        expect(instituicaoDatabaseMock.create).toHaveBeenCalledWith(expect.objectContaining({
            id: "id-mock",
            nome: "Test",
            tipo: INSTITUICAO_TIPO.PRODUCAO,
            ativo: true
        }));
    });

    test("Update should fail if instituicao not found", async () => {
        instituicaoDatabaseMock.findById.mockResolvedValue(null);
        const input = { nome: "Updated" };

        await expect(instituicaoBusiness.update("id-mock", input)).rejects.toThrow("Instituição não encontrada");
    });

    test("Update should success", async () => {
        const mockInstituicao = { id: "id-mock", nome: "Old", tipo: "producao", ativo: true };
        instituicaoDatabaseMock.findById.mockResolvedValue(mockInstituicao);

        const input = { nome: "New" };
        const result = await instituicaoBusiness.update("id-mock", input);

        expect(instituicaoDatabaseMock.update).toHaveBeenCalled();
        expect(result.nome).toBe("New");
    });

    test("Delete should fail if not found", async () => {
        instituicaoDatabaseMock.findById.mockResolvedValue(null);
        await expect(instituicaoBusiness.delete("id-mock")).rejects.toThrow("Instituição não encontrada");
    });

    test("Delete should success", async () => {
        instituicaoDatabaseMock.findById.mockResolvedValue({ id: "id-mock" });
        await instituicaoBusiness.delete("id-mock");
        expect(instituicaoDatabaseMock.delete).toHaveBeenCalledWith("id-mock");
    });
});
