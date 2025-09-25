export class Modal {
  private readonly root: HTMLElement;
  private readonly container: HTMLElement;
  private readonly closeBtn: HTMLButtonElement | null;

  constructor(rootSelector: string = '#modal-container') {
    const root = document.querySelector(rootSelector) as HTMLElement | null;
    if (!root) throw new Error('Modal root not found');
    this.root = root;
    this.container = this.root.querySelector('.modal__content') as HTMLElement;
    this.closeBtn = this.root.querySelector('.modal__close');
    this.attachBaseHandlers();
  }

  private attachBaseHandlers() {
    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) {
        this.close();
      }
    });
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
  }

  open(content: HTMLElement) {
    this.container.innerHTML = '';
    this.container.append(content);
    this.root.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.root.classList.remove('modal_active');
    document.body.style.overflow = '';
    this.container.innerHTML = '';
  }
}


