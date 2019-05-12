import { castArray, without } from 'lodash';
import { singular } from 'pluralize';

export default class Resource {
  static DEFAULT_ACTIONS = ['index', 'new', 'show', 'edit'];

  name: string;
  path: string;
  domain: string;
  only: string[];
  except: string[];

  constructor(name: string, options: any = {}) {
    this.name = name;
    this.path = options.path || this.name;
    this.domain = name;
    this.only = options.only ? castArray(options.only) : [];
    this.except = options.except ? castArray(options.except) : [];
  }

  actions() {
    return this.except.length > 0 ? without(this.availableActions(), ...this.except) : this.availableActions();
  }

  availableActions() {
    return this.only.length > 0 ? this.only : Resource.DEFAULT_ACTIONS;
  }

  plural() {
    return this.name;
  }

  singular() {
    return singular(this.name);
  }

  collectionName() {
    return this.singular() == this.plural() ? '#{plural}_index' : this.plural();
  }

  memberName() {
    return this.singular();
  }

  resourceScope() {
    return this.domain;
  }

  collectionScope() {
    return this.path;
  }

  memberScope() {
    return `${this.path}/:id`;
  }

  newScope(newPath: string) {
    return `${this.path}/${newPath}`;
  }

  nestedParam() {
    return `${this.singular()}Id`;
  }

  nestedScope() {
    return `${this.path}/:${this.nestedParam()}`;
  }
}
