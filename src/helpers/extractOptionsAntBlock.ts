import { last, isPlainObject, isFunction } from 'lodash';
import { Block } from '../types';

export default function extractOptionsAndBlock<Options>(args: any): [Options, Block] {
  let options = {};
  let block = () => {};
  if (isPlainObject(last(args))) {
    options = args.pop();
  } else if (isFunction(last(args))) {
    block = args.pop();

    if (isPlainObject(last(args))) {
      options = args.pop();
    }
  }
  return [options as Options, block];
}
