declare module 'bad-words' {
  class Filter {
    clean: (input: string) => string;
    isProfane: (input: string) => boolean;
  }

  export default Filter;
}
