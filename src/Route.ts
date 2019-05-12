export default class Route {
  name: string;
  path: string;
  precedence: number;

  constructor(name: string, path: string, precedence: number) {
    this.name = name;
    this.path = path;
    this.precedence = precedence;
  }
}
