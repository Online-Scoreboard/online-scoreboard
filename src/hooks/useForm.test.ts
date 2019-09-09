import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from './useForm';

let container: HTMLElement | null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) {
    document.body.removeChild(container);
    container = null;
  }
});

describe('useForm', () => {
  it('should set the initial form data', () => {
    // Arrange
    const initialData = { username: '', password: '' };

    // Act
    const { result } = renderHook(() => useForm(initialData));

    // Assert
    expect(result.current.formData).toBe(initialData);
  });

  it('should set a form field', () => {
    // Arrange
    const initialData = { username: '', password: '' };
    const expectedData = { username: 'test', password: '' };
    const changeEvent = {
      target: {
        name: 'username',
        value: 'test',
      },
    };

    const { result } = renderHook(() => useForm(initialData));

    // Act
    act(() => result.current.setFormField(changeEvent as any));

    // Assert
    expect(result.current.formData).toEqual(expectedData);
  });

  it('should reset the form fields to the initial values', () => {
    // Arrange
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

    // Act
    act(() => result.current.resetForm());

    // Assert
    expect(result.current.formData).toEqual(initialData);
  });
});
