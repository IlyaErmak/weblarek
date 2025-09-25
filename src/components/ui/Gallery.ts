import { Component } from '../base/Component';

export class Gallery extends Component<unknown> {
  private listRoot: HTMLElement;

  constructor(root: HTMLElement) {
    super(root);
    this.listRoot = root;
  }

  setItems(items: HTMLElement[]) {
    this.listRoot.replaceChildren(...items);
  }
}


