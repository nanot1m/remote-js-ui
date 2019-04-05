export function parseMessage<T>(
  message: string | Buffer | ArrayBuffer | Buffer[]
): T | null {
  try {
    return JSON.parse(message.toString());
  } catch (ex) {
    return null;
  }
}
