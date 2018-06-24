export class Tag {
  name: string;
  checked = false;

  constructor(name: string, checked: boolean) {
    this.name = name;
    this.checked = checked;
  }
}
