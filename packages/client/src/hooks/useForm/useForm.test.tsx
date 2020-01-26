import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { useForm } from './useForm';

describe('useForm', () => {
  interface DivProps {
    hook: any;
  }

  const Div: React.FC<DivProps> = () => <div />;

  interface InitialData {
    username: string;
    password: string;
  }

  interface TestComponentProps {
    initialData: InitialData;
  }

  const TestComponent: React.FC<TestComponentProps> = ({ initialData }) => {
    const useFormHook = useForm(initialData);
    return <Div hook={useFormHook} />;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a useForm hook without crashing', () => {
    const initialData = { username: '', password: '' };

    mount(<TestComponent initialData={initialData} />);
  });

  it('should set the initial form data', () => {
    const initialData = { username: '', password: '' };

    const wrapper = mount(<TestComponent initialData={initialData} />);

    const {
      hook: { formData },
    } = wrapper.find(Div).props();

    expect(formData).toBe(initialData);
  });

  it('should set a form field', () => {
    const initialData = { username: '', password: '' };
    const expectedData = { username: 'test', password: '' };
    const changeEvent = {
      target: {
        name: 'username',
        value: 'test',
      },
    };

    const wrapper = mount(<TestComponent initialData={initialData} />);

    const {
      hook: { setFormField },
    } = wrapper.find(Div).props();

    act(() => {
      setFormField(changeEvent);
    });

    wrapper.update();

    const {
      hook: { formData },
    } = wrapper.find(Div).props();

    expect(formData).toEqual(expectedData);
  });

  it('should reset the form fields to the initial values', () => {
    const initialData = { username: '', password: '' };
    const expectedData = { username: 'testUsername', password: 'testPassword' };
    const usernameField = {
      target: { name: 'username', value: 'testUsername' },
    };
    const passwordField = {
      target: { name: 'password', value: 'testPassword' },
    };

    const wrapper = mount(<TestComponent initialData={initialData} />);

    let setFormData = wrapper.find(Div).props().hook.setFormField;

    act(() => {
      setFormData(usernameField);
    });

    wrapper.update();
    setFormData = wrapper.find(Div).props().hook.setFormField;

    act(() => {
      setFormData(passwordField);
    });

    wrapper.update();
    let formData = wrapper.find(Div).props().hook.formData;
    expect(formData).toEqual(expectedData);

    const {
      hook: { resetForm },
    } = wrapper.find(Div).props();

    act(() => {
      resetForm();
    });

    wrapper.update();
    formData = wrapper.find(Div).props().hook.formData;
    expect(formData).toEqual(initialData);
  });
});
