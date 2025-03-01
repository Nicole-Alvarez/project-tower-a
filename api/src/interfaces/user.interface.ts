export interface ISearchUsers {
    search?: string;
    skip?: number;
    take?: number;
    userType?: string;
}

export interface IUpdateImageUsers {
    id: number;
    image:string | File;
    userType?: string;
}