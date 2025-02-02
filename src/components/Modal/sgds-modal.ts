import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { animateTo, stopAnimations } from "../../utils/animate";
import { waitForEvent } from "../../utils/event";
import Modal from "../../utils/modal";
import { lockBodyScrolling, unlockBodyScrolling } from "../../utils/scroll";
import SgdsElement from "../../base/sgds-element";
import { HasSlotController } from "../../utils/slot";
import { watch } from "../../utils/watch";
import { getAnimation, setDefaultAnimation } from "../../utils/animation-registry";
import styles from "./sgds-modal.scss";
@customElement("sgds-modal")
export class SgdsModal extends SgdsElement {
  static styles = [SgdsElement.styles, styles];

  @query(".modal") dialog: HTMLElement;
  @query(".modal-panel") panel: HTMLElement;
  @query(".modal-overlay") overlay: HTMLElement;

  private readonly hasSlotController = new HasSlotController(this, "footer");
  private modal: Modal;
  private originalTrigger: HTMLElement | null;

  @property({ type: Boolean, reflect: true }) open = false;
  // @property({ type: Boolean, reflect: true }) centeredAlignVariant = false;

  @property({ reflect: true }) title = "";
  @property({ reflect: true }) titleIcon = "";
  @property({ attribute: "no-header", type: Boolean, reflect: true }) noHeader = false;

  connectedCallback() {
    super.connectedCallback();
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.modal = new Modal(this);
  }

  firstUpdated() {
    this.dialog.hidden = !this.open;

    if (this.open) {
      this.addOpenListeners();
      this.modal.activate();
      lockBodyScrolling(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    unlockBodyScrolling(this);
  }

  /** Shows the dialog. */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, "sgds-after-show");
  }

  /** Hides the dialog */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, "sgds-after-hide");
  }

  private requestClose(source: "close-button" | "keyboard" | "overlay") {
    const slRequestClose = this.emit("sgds-close", {
      cancelable: true,
      detail: { source }
    });

    if (slRequestClose.defaultPrevented) {
      const animation = getAnimation(this, "modal.denyClose");
      animateTo(this.panel, animation.keyframes);
      return;
    }

    this.hide();
  }

  addOpenListeners() {
    document.addEventListener("keydown", this.handleDocumentKeyDown);
  }

  removeOpenListeners() {
    document.removeEventListener("keydown", this.handleDocumentKeyDown);
  }

  handleDocumentKeyDown(event: KeyboardEvent) {
    if (this.open && event.key === "Escape") {
      event.stopPropagation();
      this.requestClose("keyboard");
    }
  }

  @watch("open", { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.open) {
      // Show
      this.emit("sgds-show");
      this.addOpenListeners();
      this.originalTrigger = document.activeElement as HTMLElement;
      this.modal.activate();

      lockBodyScrolling(this);

      // When the dialog is shown, Safari will attempt to set focus on whatever element has autofocus. This can cause
      // the dialogs's animation to jitter (if it starts offscreen), so we'll temporarily remove the attribute, call
      // `focus({ preventScroll: true })` ourselves, and add the attribute back afterwards.
      //
      // Related: https://github.com/shoelace-style/shoelace/issues/693
      //
      const autoFocusTarget = this.querySelector("[autofocus]");
      if (autoFocusTarget) {
        autoFocusTarget.removeAttribute("autofocus");
      }

      await Promise.all([stopAnimations(this.dialog), stopAnimations(this.overlay)]);
      this.dialog.hidden = false;

      // Set initial focus
      requestAnimationFrame(() => {
        const slInitialFocus = this.emit("sgds-initial-focus", { cancelable: true });

        if (!slInitialFocus.defaultPrevented) {
          // Set focus to the autofocus target and restore the attribute
          if (autoFocusTarget) {
            (autoFocusTarget as HTMLInputElement).focus({ preventScroll: true });
          } else {
            this.panel.focus({ preventScroll: true });
          }
        }

        // Restore the autofocus attribute
        if (autoFocusTarget) {
          autoFocusTarget.setAttribute("autofocus", "");
        }
      });

      const panelAnimation = getAnimation(this, "modal.show");
      const overlayAnimation = getAnimation(this, "modal.overlay.show");
      await Promise.all([
        animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options),
        animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options)
      ]);

      this.emit("sgds-after-show");
    } else {
      // Hide
      this.emit("sgds-hide");
      this.removeOpenListeners();
      this.modal.deactivate();

      await Promise.all([stopAnimations(this.dialog), stopAnimations(this.overlay)]);
      const panelAnimation = getAnimation(this, "modal.hide");
      const overlayAnimation = getAnimation(this, "modal.overlay.hide");

      // Animate the overlay and the panel at the same time. Because animation durations might be different, we need to
      // hide each one individually when the animation finishes, otherwise the first one that finishes will reappear
      // unexpectedly. We'll unhide them after all animations have completed.
      await Promise.all([
        animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options).then(() => {
          this.overlay.hidden = true;
        }),
        animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options).then(() => {
          this.panel.hidden = true;
        })
      ]);

      this.dialog.hidden = true;

      // Now that the dialog is hidden, restore the overlay and panel for next time
      this.overlay.hidden = false;
      this.panel.hidden = false;

      unlockBodyScrolling(this);

      // Restore focus to the original trigger
      const trigger = this.originalTrigger;
      if (typeof trigger?.focus === "function") {
        setTimeout(() => trigger.focus());
      }

      this.emit("sgds-after-hide");
    }
  }

  render() {
    // if label is defined
    const withLabelIcon = html` <sl-icon name=${this.titleIcon} class="pe-2 flex-shrink-0"></sl-icon>`;

    return html`
      <div
        part="base"
        class=${classMap({
          modal: true,
          "modal--open": this.open,
          "modal--has-footer": this.hasSlotController.test("footer")
        })}
      >
        <div part="overlay" class="modal-overlay" @click=${() => this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="modal-panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? "false" : "true"}
          aria-label=${ifDefined(this.noHeader ? this.title : undefined)}
          aria-labelledby=${ifDefined(!this.noHeader ? "title" : undefined)}
          tabindex="0"
        >
          ${!this.noHeader
            ? html`
                <h3
                  part="header"
                  class=${classMap({
                    "modal-header": true
                    // centered: this.centeredAlignVariant,
                  })}
                >
                  <div
                    part="title"
                    class=${classMap({
                      "modal-title d-flex align-items-center": true
                      // centered : this.centeredAlignVariant,
                    })}
                    id="title"
                  >
                    ${this.titleIcon ? withLabelIcon : null}
                    ${this.title.length > 0 ? this.title : String.fromCharCode(65279)}
                  </div>
                  <sgds-button
                    part="close-button"
                    variant="icon"
                    exportparts="base:close-button__base"
                    class=${classMap({
                      "modal-close": true
                      // 'centered': this.centeredAlignVariant,
                    })}
                    @click="${() => this.requestClose("close-button")}"
                    ><sl-icon name="x-lg"></sl-icon
                  ></sgds-button>
                </h3>
              `
            : ""}

          <div part="body" class="modal-body">
            <slot></slot>
          </div>

          <footer
            part="footer"
            class=${classMap({
              "modal-footer": true
              // centered: this.centeredAlignVariant,
            })}
          >
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `;
  }
}

setDefaultAnimation("modal.show", {
  keyframes: [
    { opacity: 0, transform: "scale(0.8)" },
    { opacity: 1, transform: "scale(1)" }
  ],
  options: { duration: 250, easing: "ease" }
});

setDefaultAnimation("modal.hide", {
  keyframes: [
    { opacity: 1, transform: "scale(1)" },
    { opacity: 0, transform: "scale(0.8)" }
  ],
  options: { duration: 250, easing: "ease" }
});

setDefaultAnimation("modal.denyClose", {
  keyframes: [{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }],
  options: { duration: 250 }
});

setDefaultAnimation("modal.overlay.show", {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250 }
});

setDefaultAnimation("modal.overlay.hide", {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250 }
});

export default SgdsModal;
