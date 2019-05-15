import { draw } from '../src';

describe('drawer', () => {
  describe('resources', () => {
    it('works', () => {
      const routes = draw(({ resources }) => {
        resources('posts');
      });
      expect(routes).toMatchSnapshot();
    });

    it('nested', () => {
      const routes = draw(({ resources }) => {
        resources('posts', () => {
          resources('comments');
        });
      });
      expect(routes).toMatchSnapshot();
    });
  });
});
