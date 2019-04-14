module.exports = {
  conf: {
    alias: 'f',
    description: 'Path to applitools.config.js config file',
    requiresArg: true,
    string: true,
  },

  storybookUrl: {
    alias: ['storybook-url', 'u'],
    description: 'URL to storybook',
    requiresArg: true,
    string: true,
  },

  // storybook options
  storybookPort: {
    alias: ['storybook-port', 'p'],
    description: 'Port to run Storybook',
    requiresArg: false,
    number: true,
  },
  storybookHost: {
    alias: ['storybook-host', 'h'],
    description: 'Host to run Storybook',
    requiresArg: false,
    string: true,
  },
  storybookConfigDir: {
    alias: ['storybook-config-dir', 'c'],
    description: "Path to Storybook's config folder (defaults to .storybook)",
    requiresArg: true,
    string: true,
  },
  storybookStaticDir: {
    alias: ['storybook-static-dir', 's'],
    description: "Path to Storybook's static files folder",
    requiresArg: true,
    string: true,
  },
  showStorybookOutput: {
    alias: ['show-storybook-output'],
    description: 'whether or not you want to see Storybook output',
    requiresArg: true,
    boolean: true,
  },

  // general
  exitcode: {
    alias: 'e',
    description: 'If tests failed close with non-zero exit code',
    requiresArg: false,
    boolean: true,
  },
};
