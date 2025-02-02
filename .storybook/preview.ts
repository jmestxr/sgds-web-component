import { setCustomElements } from "@storybook/web-components";
import customElements from "../custom-elements.json";

// import { setCustomElementsManifest } from '@storybook/web-components';

// export const setCustomElementsManifestWithOptions = (
//   customElements: any,
//   options: { privateFields?: boolean },
// ): void => {
//   let { privateFields = true } = options;
//   if (!privateFields) {
//     customElements?.modules?.forEach((module: { declarations: any[] }) => {
//       module?.declarations?.forEach(declaration => {
//         Object.keys(declaration).forEach(key => {
//           if (Array.isArray(declaration[key])) {
//             declaration[key] = declaration[key].filter(
//               (member: { privacy: string | string[] }) =>
//                 !member.privacy?.includes('private'),
//             );
//           }
//         });
//       });
//     });
//   }
//   return setCustomElementsManifest(customElements);
// };
setCustomElements(customElements);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  options: {
    storySort: {
      order: ["Getting Started", ["Installation", "Imports"], "Frameworks", "Components"]
    }
  }
};
