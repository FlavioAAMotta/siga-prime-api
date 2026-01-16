
import { Request, Response, NextFunction } from "express";
import { TokenManager, USER_ROLES } from "../services/TokenManager";

export class AuthMiddleware {
    constructor(
        private tokenManager: TokenManager
    ) { }

    public handle = (roles: USER_ROLES[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = req.headers.authorization as string;

                if (!token) {
                    res.status(401).send({ error: "Token missing" });
                    return
                }

                const payload = this.tokenManager.getPayload(token);

                if (!payload) {
                    res.status(401).send({ error: "Invalid token" });
                    return
                }

                if (!roles.includes(payload.role)) {
                    res.status(403).send({ error: "Insufficient privileges" });
                    return
                }

                next();
            } catch (error: any) {
                res.status(500).send({ error: error.message });
            }
        }
    }
}
