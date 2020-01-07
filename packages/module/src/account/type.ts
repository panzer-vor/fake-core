import {ColumnProps} from "antd/lib/table";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOAD_USERS = "LOAD_USERS";

export interface Pagination {
    pageSize: number;
    page: number;
    total: number;
    current: number;
}


export class Pagination implements Pagination {
    constructor(page: number = 1, pageSize: number = 10) {
        this.total = 0;
        this.page = page;
        this.pageSize = pageSize;
    }

    get skip() {
        return this.page > 0 ? (this.page - 1) * this.pageSize : 0;
    }

    set skip(skip: number) {
        this.page = skip / this.pageSize + 1;
    }

    get limit() {
        return this.pageSize;
    }

    set limit(limit: number) {
        this.pageSize = limit;
    }
}

export interface LoggedUser {
    roles: string[] | null;
    email: string | null;
    fullName: string | null;
}

export interface LoggedState {
    success: boolean;
    errorMessage: string | null;
}

export interface State {
    currentUser: LoggedUser;
    login: LoggedState;
}

export interface User {
    id: string;
    username: string;
    createTime: string;
}

export interface UserListState {
    users: User[];
    columns: Array<ColumnProps<User>>;
    pagination: Pagination;
}
