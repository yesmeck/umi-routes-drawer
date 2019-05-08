import { draw, page } from '../src';

describe('drawer', () => {
  it('path', () => {
    const routes = draw(() => {
      page('/', { component: '/pages/index' });
    });
    expect(routes).toEqual([{ path: '/', component: '/pages/index' }]);
  });
});
