export class Tag {
  value: string;
  checked = false;

  constructor(value: string, checked: boolean) {
    this.value = value;
    this.checked = checked;
  }
}
