import { LitElement } from "lit";
import styles from "./sgds-element.scss";
export default class SgdsElement extends LitElement {
  static styles = styles;
  /** Emits a custom event with more convenient defaults. */
  emit(name: string, options?: CustomEventInit) {
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {},
      ...options
    });

    this.dispatchEvent(event);

    return event;
  }
}

export interface SgdsFormControl extends SgdsElement {
  // Form attributes
  name: string;
  value: unknown;
  disabled?: boolean;
  defaultValue?: unknown;
  defaultChecked?: boolean;
  form?: string;

  // Constraint validation attributes
  pattern?: string;
  min?: number | string | Date;
  max?: number | string | Date;
  step?: number | "any";
  required?: boolean;
  minlength?: number;
  maxlength?: number;
}
