module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier'
  ],
  customSyntax: 'postcss-html',
  rules: {
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        'ignore': ['consecutive-duplicates']
      }
    ],
    'font-family-no-duplicate-names': true,
    'font-family-no-missing-generic-family-keyword': true,
    'function-no-unknown': true,
    'keyframe-declaration-no-important': true,
    'media-feature-name-no-unknown': true,
    'no-descending-specificity': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-extra-semicolons': true,
    'no-invalid-double-slash-comments': true,
    'property-no-unknown': true,
    'selector-max-id': 0,
    'selector-no-qualifying-type': [
      true,
      {
        'ignore': ['attribute']
      }
    ],
    'selector-pseudo-element-no-unknown': true,
    'unit-no-unknown': true,
    'value-no-vendor-prefix': true,
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['default-namespace']
      }
    ],
    'no-eol-whitespace': null,
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['custom-elements', 'default-namespace']
      }
    ]
  }
};
