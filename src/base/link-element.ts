import { html } from "lit";
import SgdsElement from "./sgds-element";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

/**
 * @slot default - Default slot for SgdsMainnavItem anchor element
 */

export default class LinkElement extends SgdsElement {
  static styles = SgdsElement.styles;

  /** when true, sets the active stylings of .nav-link */
  @property({ type: Boolean })
  active = false;

  /** Href attribute for anchor element in SgdsMainnavItem */
  @property({ type: String })
  href = "";

  /** Disables the SgdsMainnavItem */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  render() {
    return html`
      <li>
        <a
          href="${this.href}"
          class="nav-link ${classMap({
            disabled: this.disabled,
            active: this.active
          })} "
          ?disabled=${this.disabled}
          aria-disabled=${this.disabled ? "true" : "false"}
          ><slot></slot
        ></a>
      </li>
    `;
  }
}
