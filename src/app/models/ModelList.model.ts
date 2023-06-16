export class ModelList<T>{
  public constructor(
    public List: Array<T>,
    public PossibleError: string,
    public TotalRecords: number) { }
}
