declare module "ansi-to-json" {
  export interface AnsiNode {
    content: string;
    fg: string | null;
    bg: string | null;
    fg_truecolor: string | null;
    bg_truecolor: string | null;
    was_processed: boolean;
  }

  declare function ansiToJson(input: string): AnsiNode[];

  export default ansiToJson;
}
