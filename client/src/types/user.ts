
export interface User {
    id: string;
    username: string;
}

export interface AuthUser extends User {
    email: string;
}