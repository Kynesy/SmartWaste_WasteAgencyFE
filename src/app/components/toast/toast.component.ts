import { Component, TemplateRef } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styles: [
  ]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

	isTemplate(toast: { textOrTpl: any; }) {
		return toast.textOrTpl instanceof TemplateRef;
	}
}
