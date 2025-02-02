import { assert, expect, fixture } from "@open-wc/testing";
import { html } from "lit";
import sinon from "sinon";
import "../src/components/Alert/sgds-alert";
import { SgdsAlert } from "../src/components/Alert/sgds-alert";
import { SgdsCloseButton } from "../src/components/CloseButton";

describe("<Alert>", () => {
  it("Should output a alert with message", async () => {
    const message = "This is a test alert";
    const el = await fixture<SgdsAlert>(html` <sgds-alert>${message}</sgds-alert> `);

    const alert = el.shadowRoot?.querySelector(".alert");
    assert.exists(alert, "Alert element exists");

    const slot = el.shadowRoot?.querySelector("slot");
    const slotContent = slot?.assignedNodes()[0]?.textContent;
    expect(slotContent).to.equal(message);
  });

  it("Should have dismissible style", async () => {
    const el = await fixture<SgdsAlert>(html` <sgds-alert dismissible></sgds-alert> `);

    const alert = el.shadowRoot?.querySelector(".sgds.alert");
    expect(alert?.classList.value).to.contain("alert-dismissible");
  });
  it('Should default to variant="primary"', async () => {
    const el = await fixture<SgdsAlert>(html` <sgds-alert></sgds-alert> `);

    const alert = el.shadowRoot?.querySelector(".alert");
    assert.isTrue(alert?.classList.contains("alert-primary"));
  });

  it("Should trigger the handleCloseClick method and emit the sgds-hide event on dismiss click of sgds-closebutton", async () => {
    const el = await fixture<SgdsAlert>(html`<sgds-alert dismissible></sgds-alert>`);
    const onCloseSpy = sinon.spy();
    el.addEventListener("sgds-hide", onCloseSpy);

    const closeButton = el.shadowRoot?.querySelector("sgds-closebutton") as SgdsCloseButton;
    closeButton?.click();

    expect(onCloseSpy).to.have.been.calledOnce;
  });

  it("Should use variant class", async () => {
    const el = await fixture<SgdsAlert>(html` <sgds-alert variant="warning"></sgds-alert> `);

    const alert = el.shadowRoot?.querySelector(".alert");
    assert.isTrue(alert?.classList.contains("alert-warning"));
  });

  it("should have fade class when rendered", async () => {
    const el = await fixture(html`<sgds-alert variant="primary">Test alert</sgds-alert>`);
    const base = el.shadowRoot?.querySelector(".sgds.alert");
    expect(base?.classList.contains("fade")).to.be.true;
  });

  it("should not have show class when rendered", async () => {
    const el = await fixture(html`<sgds-alert variant="primary">Test alert</sgds-alert>`);
    const base = el.shadowRoot?.querySelector(".sgds.alert");
    expect(base?.classList.contains("show")).to.be.false;
  });

  it("when show is true, alert should have show class", async () => {
    const el = await fixture(html`<sgds-alert variant="primary" show>Test alert</sgds-alert>`);
    const base = el.shadowRoot?.querySelector(".sgds.alert");
    console.log(base);
    expect(base?.classList.contains("show")).to.be.true;
  });

  describe("Web Accessibility", () => {
    it("Should have alert role", async () => {
      const el = await fixture(html`<sgds-alert></sgds-alert>`);
      const alertEl = el.shadowRoot?.querySelector('[part="base"]');
      assert.equal(alertEl?.getAttribute("role"), "alert");
    });
  });
});
