import type { INotebookSettings } from "../models/INotebookSettings";

let settingCollection : { [user: string]: INotebookSettings } = {};

const setDefaultNotebookSettings = (user:string, notebookId: string, notebookKey: string) => {
    const settings: INotebookSettings = {
        notebookId,
        notebookKey
    };
    settingCollection[user] = settings;
    console.log(`Default notebook settings updated for user ${user}: notebookId="${notebookId}", notebookKey="${notebookKey}"`);
}

const getDefaultNotebookSettings = (user:string): INotebookSettings | null => {
    const settings = settingCollection[user];
    if (!settings) return null;
    return settings;
}

const clearDefaultNotebookSettings = (user:string) => {
    delete settingCollection[user];
    console.log(`Default notebook settings cleared for user ${user}`);
}

export const UserServices = {
    setDefaultNotebookSettings,
    getDefaultNotebookSettings,
    clearDefaultNotebookSettings
}