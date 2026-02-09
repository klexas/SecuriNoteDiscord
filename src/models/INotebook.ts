export interface INotebook {
    notebook : {
        id: string;
        name: string;
        alias: string | null;
        owner_id: string;
        content: string;
        createdAt: string;
        updatedAt: string;
        expiresAt: string | null;
        status: string;
        accessCount: number;
        isOwner: boolean;
    }
}