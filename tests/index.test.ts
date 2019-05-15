import { draw } from '../src';

describe('drawer', () => {
  describe('resources', () => {
    it('works', () => {
      const routes = draw(({ resources }) => {
        resources('posts');
      });
      expect(routes).toMatchSnapshot();
    });

    it('nested resources', () => {
      const routes = draw(({ resources }) => {
        resources('posts', () => {
          resources('comments');
        });
      });
      expect(routes).toMatchSnapshot();
    });

    it('nested collections', () => {
      const routes = draw(({ page, resources, collection }) => {
        resources('posts', () => {
          collection(() => {
            page('pulse');
          });
        });
      });
      expect(routes).toMatchSnapshot();
    });

    it('nested remember', () => {
      const routes = draw(({ page, resources, member }) => {
        resources('posts', () => {
          member(() => {
            page('draft');
          });
        });
      });
      expect(routes).toMatchSnapshot();
    });
  });
});
