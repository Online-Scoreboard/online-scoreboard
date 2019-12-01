import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '.';

describe('useForm', () => {
  it('should set the initial form data', () => {
    const initialData = { username: '', password: '' };
    const { result } = renderHook(() => useForm(initialData));

    expect(result.current.formData).toBe(initialData);
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

    const { result } = renderHook(() => useForm(initialData));

    act(() => result.current.setFormField(changeEvent as any));

    expect(result.current.formData).toEqual(expectedData);
  });

  it('should reset the form fields to the initial values', () => {
    const initialData = { username: '', password: '' };
    const expectedData = { username: 'testUsername', password: 'testPassword' };

    const { result } = renderHook(() => useForm(initialData));

    const usernameField = {
      target: { name: 'username', value: 'testUsername' },
    };
    const passwordField = {
      target: { name: 'password', value: 'testPassword' },
    };

    act(() => result.current.setFormField(usernameField as any));
    act(() => result.current.setFormField(passwordField as any));

    expect(result.current.formData).toEqual(expectedData);

    act(() => result.current.resetForm());

    expect(result.current.formData).toEqual(initialData);
  });
});
