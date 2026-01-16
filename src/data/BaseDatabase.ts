import connection from "./connection";
import { v7 as uuidv7 } from "uuid";

export interface QueryParams {
    select?: string;
    order?: { column: string; dir: "asc" | "desc" };
    limit?: number;
    filters?: Record<string, any>;
    rangeFilters?: {
        column: string;
        operator: ">=" | "<=" | "!=" | "like";
        value: any;
    }[];
}

export abstract class BaseDatabase {
    protected abstract table: string;

    public find = async (params: QueryParams): Promise<any[]> => {
        let query = connection()(this.table);

        if (params.select && params.select !== "*") {
            const cols = params.select.split(",").map(c => c.trim());
            query = query.select(cols);
        } else {
            query = query.select("*");
        }

        if (params.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                if (value === "true") value = true;
                if (value === "false") value = false;
                query = query.where(key, value);
            });
        }

        if (params.rangeFilters) {
            params.rangeFilters.forEach(filter => {
                query = query.where(filter.column, filter.operator, filter.value);
            });
        }

        if (params.order) {
            query = query.orderBy(params.order.column, params.order.dir);
        }

        if (params.limit) {
            query = query.limit(params.limit);
        }

        const result = await query;
        return result;
    }

    public findById = async (id: string): Promise<any | null> => {
        const result = await connection()(this.table)
            .select("*")
            .where({ id })
            .first();

        return result || null;
    }

    public create = async (data: any): Promise<any> => {
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (!item.id) {
                    item.id = uuidv7();
                }
            });
        } else {
            if (!data.id) {
                data.id = uuidv7();
            }
        }

        await connection()(this.table).insert(data);
        return data;
    }

    public update = async (id: string, data: any): Promise<void> => {
        await connection()(this.table)
            .where({ id })
            .update(data);
    }

    public delete = async (id: string): Promise<void> => {
        await connection()(this.table)
            .where({ id })
            .del();
    }
}
