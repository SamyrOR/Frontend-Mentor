import {
  ComponentRef,
  Injectable,
  Renderer2,
  RendererFactory2,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private renderer!: Renderer2;
  private componentRef!: ComponentRef<ModalComponent>;
  private componentSubscriber!: Subject<string>;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  openModal(
    entry: ViewContainerRef,
    modalTitle: string,
    modalBody: string
  ): Observable<string> {
    this.componentRef = entry.createComponent(ModalComponent);
    this.componentRef.instance.title = modalTitle;
    this.componentRef.instance.body = modalBody;
    this.componentRef.instance.closeMeEvent.subscribe(() => this.closeModal());
    this.componentRef.instance.confirmEvent.subscribe(() => this.confirm());
    this.componentSubscriber = new Subject<string>();
    this.disableScroll(true);
    return this.componentSubscriber.asObservable();
  }

  closeModal() {
    this.componentSubscriber.complete();
    this.componentRef.destroy();
    this.disableScroll(false);
  }

  confirm() {
    this.componentSubscriber.next('confirm');
    this.closeModal();
    this.disableScroll(false);
  }

  disableScroll(isDisabled: boolean) {
    isDisabled
      ? this.renderer.setStyle(document.body, 'overflow', 'hidden')
      : this.renderer.setStyle(document.body, 'overflow', 'auto');
  }
}
