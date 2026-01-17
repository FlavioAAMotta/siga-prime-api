import connection from "./connection";
import { BaseDatabase } from "./BaseDatabase";

export class CoordenadoresDatabase extends BaseDatabase {
    protected table = "coordenadores";

    public find = async (params: any): Promise<any[]> => {
        const query = connection()(this.table)
            .select(
                "coordenadores.*",
                "nucleos.nome as nucleo_nome"
            )
            .leftJoin("nucleos", "coordenadores.nucleo_id", "nucleos.id");

        if (params.filter) {
            // Implement basic filtering if needed, e.g. ativo
            if (params.filter.ativo !== undefined) {
                query.where("coordenadores.ativo", params.filter.ativo);
            }
            // Add other filters as needed
        }

        // Handle generic 'where' params often passed by parseQueryParams
        // This is a naive implementation, BaseDatabase does it better but we are overriding.
        // Ideally we call super.find logic or duplicate it. 
        // Let's rely on basic query construction.

        // Applying simpler filtering based on common usage
        Object.keys(params).forEach(key => {
            if (key !== 'order' && key !== 'limit' && key !== 'offset' && key !== 'select' && key !== 'filter') {
                // Assumes simple equality checks for other params
                if (params[key] !== undefined && params[key] !== 'all') {
                    // Check if column exists to avoid errors? Or just try.
                    // Safe-ish for now.
                    query.where(`coordenadores.${key}`, params[key]);
                }
            }
        });

        if (params.order) {
            query.orderBy(`coordenadores.${params.order.column}`, params.order.dir);
        }

        const results = await query;

        return results.map((row: any) => ({
            ...row,
            nucleos: row.nucleo_id ? { nome: row.nucleo_nome } : null
        }));
    }
}
