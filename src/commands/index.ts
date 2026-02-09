import type { ICommand } from "../models/ICommand";
import PingCommand from "./ping";
import GetNotebookCommand from "./getNotebook";
import SearchNotebookCommand from "./searchNotebook";
import SetNotebookSettingsCommand from "./setNotebookSettings";

export const Commands: { [key: string]: ICommand } = {
    "ping": PingCommand,
    "getnotebook": GetNotebookCommand,
    "searchnotebook": SearchNotebookCommand,
    "setnotebooksettings": SetNotebookSettingsCommand
};