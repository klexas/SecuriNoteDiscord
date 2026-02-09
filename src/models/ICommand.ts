export interface ICommand {
  command: any;
  execute: (interaction: any) => Promise<any>;
}