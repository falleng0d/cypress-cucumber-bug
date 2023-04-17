import badeball from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { NodeModulesPolyfillPlugin as nodePolyfills } from '@esbuild-plugins/node-modules-polyfill';
import { defineConfig } from 'cypress';

import { getSetupAndTeardownTasks } from './cypress/plugins/setup-teardown';

export default defineConfig({
  defaultCommandTimeout: 20000,
  taskTimeout: 120000,
  video: true,
  screenshotOnRunFailure: true,
  supportFolder: 'support',
  responseTimeout: 60000,
  viewportWidth: 1366,
  viewportHeight: 768,
  e2e: {
    specPattern: 'cypress/e2e/**/*.feature',
    experimentalStudio: true,
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      // This is required for the preprocessor to be able to generate JSON
      // reports after each run, and more
      await badeball.addCucumberPreprocessorPlugin(on, config);

      config.baseUrl = 'https://example.cypress.io'

      const deviceMode: 'edge' | 'cloud' = 'edge';

      if(deviceMode == 'edge') {
        console.log(`\x1b[33m[INFO]: Running tests in edge mode\x1b[0m`);
        config.env.TAGS = `(${config.env.TAGS}) and not @cloud`;
      } else {
        console.log(`\x1b[33m[INFO]: Running tests in cloud mode\x1b[0m`);
        config.env.TAGS = `(${config.env.TAGS}) and @cloud`;
      }

      on(
        'file:preprocessor',
        createBundler({
          plugins: [nodePolyfills(), createEsbuildPlugin(config)],
        })
      );

      on('task', getSetupAndTeardownTasks());

      // Make sure to return the config object as it might have been modified
      // by the plugin.
      return config;
    },
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'results/e2e-results-[hash].xml',
  },
});
