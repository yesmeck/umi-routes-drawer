import { draw } from '../src';

describe('drawer', () => {
  describe('resources', () => {
    it('works', () => {
      const routes = draw(({ resources }) => {
        resources('posts');
      });
      expect(routes).toMatchSnapshot();
    });
  });
});
