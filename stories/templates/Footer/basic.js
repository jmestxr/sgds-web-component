import { html } from "lit-html";

export const Template = args => {
  return html`
    <sgds-footer
      title=${args.title}
      description=${args.description}
      lastUpdatedDate=${args.lastUpdatedDate}
      contactHref=${args.contactHref}
      feedbackHref=${args.feedbackHref}
      privacyHref=${args.privacyHref}
      termsOfUseHref=${args.termsOfUseHref}
      .links=${args.links}
      copyrightLiner=${args.copyrightLiner}
    >
    </sgds-footer>
  `;
};

export const args = {
  title: "Singapore Government Design System",
  description:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum illo delectus laborum libero id ratione quibusdam tempora assumenda quas, pariatur cum minus, aliquid molestiae et nisi dolorem vitae molestias! Voluptate commodi aliquid iusto sequi sit eligendi, quod numquam nihil consectetur eaque error earum laudantium! Temporibus accusamus pariatur quod totam quia.",
  lastUpdatedDate: "01 Sep 2020",
  contactHref: "https://form.gov.sg/",
  feedbackHref: "https://form.gov.sg/",
  privacyHref: "https://www.designsystem.tech.gov.sg/privacy/",
  termsOfUseHref: "https://www.designsystem.tech.gov.sg/terms-of-use/",
  copyrightLiner: "Government of Singapore",
  links: [
    {
      title: "Column 1",
      links: [
        {
          href: "#1",
          label: "About Us"
        },
        {
          href: "#2",
          label: "This is a super long link"
        },
        {
          href: "#3",
          label: "Test"
        },
        {
          href: "#4",
          label: "Test"
        }
      ]
    },
    {
      title: "Column 2",
      links: [
        {
          href: "#1",
          label: "About Us"
        },
        {
          href: "#2",
          label: "This is a super long link"
        },
        {
          href: "#3",
          label: "Test"
        },
        {
          href: "#4",
          label: "Test"
        }
      ]
    },
    {
      title: "Column 3",
      links: [
        {
          href: "#1",
          label: "About Us"
        },
        {
          href: "#2",
          label: "This is a super long link"
        },
        {
          href: "#3",
          label: "Test"
        },
        {
          href: "#4",
          label: "Test"
        }
      ]
    },
    {
      title: "Column 4",
      links: [
        {
          href: "#1",
          label: "About Us"
        },
        {
          href: "#2",
          label: "This is a super long link"
        },
        {
          href: "#3",
          label: "Test"
        },
        {
          href: "#4",
          label: "Test"
        }
      ]
    },
    {
      title: "Column 5",
      links: [
        {
          href: "#1",
          label: "About Us"
        },
        {
          href: "#2",
          label: "This is a super long link"
        },
        {
          href: "#3",
          label: "Test"
        },
        {
          href: "#4",
          label: "Test"
        }
      ]
    },
    {
      title: "Column 6",
      links: [
        {
          href: "#1",
          label: "About Us"
        },
        {
          href: "#2",
          label: "This is a super long link"
        },
        {
          href: "#3",
          label: "Test"
        },
        {
          href: "#4",
          label: "Test"
        }
      ]
    }
  ]
};
