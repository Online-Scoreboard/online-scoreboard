declare module 'bad-words' {
  class Filter {
    clean: (input: string) => string;
  }

  export default Filter;
}
