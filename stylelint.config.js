/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
      {
        resolveNestedSelectors: true,
        message: (selector) =>
          `Expected class "${selector}" to follow BEM (block__element--modifier)`,
      },
    ],
    "max-nesting-depth": 3,
  },
};
