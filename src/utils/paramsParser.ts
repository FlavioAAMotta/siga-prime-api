import { QueryParams } from "../data/BaseDatabase";

export const parseQueryParams = (query: any): QueryParams => {
    const params: QueryParams = {};

    Object.entries(query).forEach(([key, value]) => {
        if (key === "select") {
            params.select = value as string;
        } else if (key === "limit") {
            params.limit = Number(value);
        } else if (key === "order") {
            const separator = (value as string).includes(":") ? ":" : " ";
            const [column, dir] = (value as string).split(separator);
            params.order = { column, dir: dir ? (dir.toLowerCase() as "asc" | "desc") : "asc" };
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
