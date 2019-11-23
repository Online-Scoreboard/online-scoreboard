declare module 'bad-words' {
  class Filter {
    public clean: (input: string) => string;
    public isProfane: (input: string) => boolean;
  }

  export default Filter;
}
