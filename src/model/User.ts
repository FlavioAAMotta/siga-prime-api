
export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    PRECEPTOR = "PRECEPTOR"
}

export interface User {
    id: string;
    email: string;
    password?: string;
    created_at: Date;
}

export interface SignupInputDTO {
    email: string;
    password: string;
}

export interface LoginInputDTO {
    email: string;
    password: string;
}
