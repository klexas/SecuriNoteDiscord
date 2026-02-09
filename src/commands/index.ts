import type { ICommand } from "../models/ICommand";
import PingCommand from "./ping";
import GetNotebookCommand from "./getNotebook";
import SearchNotebookCommand from "./searchNotebook";
import SetNotebookSettingsCommand from "./setNotebookSettings";
import ClearSettingsCommand from "./clearSettings";
import AddToNotebookCommand from "./addToNotebook";

export const Commands: { [key: string]: ICommand } = {
    "ping": PingCommand,
    "getnotebook": GetNotebookCommand,
    "searchnotebook": SearchNotebookCommand,
    "setnotebooksettings": SetNotebookSettingsCommand,
    "clearsettings": ClearSettingsCommand,
    "addtonotebook": AddToNotebookCommand
};