import { QueryParams } from "../data/BaseDatabase";

export const parseQueryParams = (query: any): QueryParams => {
    const params: QueryParams = {};

    Object.entries(query).forEach(([key, value]) => {
        if (key === "select") {
            params.select = value as string;
        } else if (key === "limit") {
            params.limit = Number(value);
        } else if (key === "order") {
            const [column, dir] = (value as string).split(" ");
            params.order = { column, dir: dir.toLowerCase() as "asc" | "desc" };
        } else if (key.startsWith("gte_")) {
            params.rangeFilters = params.rangeFilters || [];
            params.rangeFilters.push({ column: key.replace("gte_", ""), operator: ">=", value });
        } else if (key.startsWith("lte_")) {
            params.rangeFilters = params.rangeFilters || [];
            params.rangeFilters.push({ column: key.replace("lte_", ""), operator: "<=", value });
        } else if (key.startsWith("neq_")) {
            params.rangeFilters = params.rangeFilters || [];
            params.rangeFilters.push({ column: key.replace("neq_", ""), operator: "!=", value });
        } else {
            params.filters = params.filters || {};
            params.filters[key] = value;
        }
    });

    return params;
}
