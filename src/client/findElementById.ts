export function findElementById<T extends HTMLElement>(
  id: string,
  klass: { new (): T }
): T {
  const node = document.getElementById(id);
  if (node instanceof klass) {
    return node;
  }
  throw new Error("id is not " + klass.name);
}
