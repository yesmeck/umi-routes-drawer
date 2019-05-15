import Resource from './Resource';
import { plural } from 'pluralize';

export default class SingleResource extends Resource {
  defaultActions() {
    return ['show', 'new', 'edit'];
  }

  plural() {
    return plural(this.name);
  }

  singular() {
    return this.name;
  }

  memberScope() {
    return this.path;
  }

  isSingleton() {
    return true;
  }
}
