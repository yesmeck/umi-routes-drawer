import Resource from './Resource';
import { plural } from 'pluralize';
import alias from './helpers/alias';

export default class SingleResource extends Resource {
  defaultActions() {
    return ['show', 'new', 'edit'];
  }

  plural() {
    return plural(this.name);
  }

  @alias('memberName', 'collectionName')
  singular() {
    return this.name;
  }

  @alias('nestedScope')
  memberScope() {
    return this.path;
  }

  isSingleton() {
    return true;
  }
}
