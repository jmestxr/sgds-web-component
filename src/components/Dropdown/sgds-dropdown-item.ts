import { html } from "lit";
import { customElement, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import LinkElement from "../../base/link-element";
import styles from "./sgds-dropdown.scss";

@customElement("sgds-dropdown-item")
export class SgdsDropdownItem extends LinkElement {
  static styles = [LinkElement.styles, styles];

  @query("a")
  anchor: HTMLElement;
  firstUpdated() {
    //required when navigate with ArrowDown/ArrowUp
    this.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        this.anchor.click();
      }
    });
  }

  render() {
    return html`
      <li>
        <a
          href="${this.href}"
          class="dropdown-item ${classMap({
            disabled: this.disabled,
            active: this.active
          })}"
          ?disabled=${this.disabled}
          aria-disabled=${this.disabled ? "true" : "false"}
          tabindex=${this.disabled ? "-1" : "0"}
          ><slot></slot
        ></a>
      </li>
    `;
  }
}

export default SgdsDropdownItem;
