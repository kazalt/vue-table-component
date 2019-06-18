import TableComponent from '@/components/TableComponent.vue';
import TableColumn from '@/components/TableColumn';

describe('TableComponent', () => {
  let component, localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.component('table-column', TableColumn);

    TableComponent.__Rewire__('expiringStorage', {
      get() { return null; },
    });
  });

  context('with data', () => {
    let data;

    function initMockComponent({ lastNameHidden = false } = {}) {
      data = [
        { firstName: 'mew', lastName: 'pew' },
        { firstName: 'maw', lastName: 'paw' },
      ];

      const defaultSlot = `
        <table-column show="firstName" label="First name"></table-column>
        <table-column show="lastName" label="Last name" :hidden="${lastNameHidden}"></table-column>
      `;

      return mockTableComponent({
        data: data,
      }, {
        slots: {
          default: defaultSlot,
        },
      });
    }

    it('should display headers', async() => {
      const component = initMockComponent();
      await component.vm.$nextTick();

      const headers = component.findAll('th').wrappers;
      const headerTitles = headers.map((header) => header.text());

      expect(headerTitles).to.deep.equal(['First name', 'Last name']);
    });

    it('should display content', async() => {
      const component = initMockComponent();
      await component.vm.$nextTick();

      const trWrappers = component.findAll('tbody tr').wrappers;
      const mappedRows = trWrappers.map((tr) => {
        const tdWrappers = tr.findAll('td').wrappers;
        return tdWrappers.map((element) => element.text());
      });

      const expectedValues = data.map((item) => Object.values(item));
      expect(mappedRows).to.deep.equal(expectedValues);
    });

    context('when lastName is hidden', () => {
      let component;

      beforeEach(async() => {
        component = initMockComponent({ lastNameHidden: true });
        await component.vm.$nextTick();
      });

      it('should not display lastName header', async() => {
        const headers = component.findAll('th').wrappers;
        const headerTitles = headers.map((header) => header.text());

        expect(headerTitles).to.deep.equal(['First name']);
      });

      it('should not display lastName content', async() => {
        const trWrappers = component.findAll('tbody tr').wrappers;
        const mappedRows = trWrappers.map((tr) => {
          const tdWrappers = tr.findAll('td').wrappers;
          return tdWrappers.map((element) => element.text());
        });

        const expectedValues = data.map((item) => {
          delete item.lastName;
          return Object.values(item)
        });
        expect(mappedRows).to.deep.equal(expectedValues);
      });
    });
  });

  function mockTableComponent(propsData, options) {
    const defaultProps = {};
    return mount(TableComponent, {
      localVue: localVue,
      propsData: {
        ...defaultProps,
        ...propsData,
      },
      ...options,
    });
  }
});
