export default class Scope {
  static OPTIONS = [
    'path',
    'shallow_path',
    'as',
    'shallow_prefix',
    'module',
    'controller',
    'action',
    'path_names',
    'shallow',
    'blocks',
    'defaults',
    'via',
    'format',
    'options',
    'to'
  ];

  static RESOURCE_SCOPES = ['resource', 'resources'];
  static RESOURCE_METHOD_SCOPES = ['collection', 'member', 'new'];

  hash: any;
  parent: Scope | null;
  scopeLevel: any;

  constructor(hash: any, parent: Scope | null = null, scopeLevel: string | null = null) {
    this.hash = hash;
    this.parent = parent;
    this.scopeLevel = scopeLevel;
  }

  new(hash: any) {
    return new Scope(hash, this, this.scopeLevel);
  }

  newLevel(level: string) {
    return new Scope(this.hash, this, level);
  }

  isResourceScope() {
    return Scope.RESOURCE_SCOPES.includes(this.scopeLevel);
  }

  isResourceMethodScope() {
    return Scope.RESOURCE_METHOD_SCOPES.includes(this.scopeLevel);
  }

  get(key: string) {
    const scope = this.find(node => node.hash[key]);
    return scope && scope.hash[key];
  }

  find(callback: (scope: Scope) => boolean) {
    let node: Scope | null = this;
    while (node !== null) {
      if (callback(node)) {
        return node;
      }
      node = node.parent;
    }
  }

  actionName(prefix: string, collectionName: string, memberName: string) {
    switch (this.scopeLevel) {
      case 'nested':
        return [prefix];
      case 'collection':
        return [prefix, collectionName];
      case 'new':
        return [prefix, 'new', memberName];
      case 'root':
        return [collectionName, prefix];
      default:
        return [memberName, prefix];
    }
  }

  options() {
    return Scope.OPTIONS;
  }
}
