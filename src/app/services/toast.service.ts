import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: any[] = [];

	private show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
		this.toasts.push({ textOrTpl, ...options });
	}

	remove(toast: any) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}

  showSuccessToast(text: string){
		this.show(text, { classname: 'position-relative bottom-0 end-0 bg-success text-light'});
  }

  showErrorToast(text: string){
		this.show(text, { classname: 'position-relative bottom-0 end-0 bg-danger text-light'});
  }
}
