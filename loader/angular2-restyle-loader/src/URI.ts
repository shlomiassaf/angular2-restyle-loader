export class URI {
  constructor(public path: string) {}

  static isURI(obj: any): obj is URI {
    return obj instanceof URI;
  }
}
