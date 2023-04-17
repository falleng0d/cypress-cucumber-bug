import {
  After,
  Before,
  Given,
  Then,
} from '@badeball/cypress-cucumber-preprocessor';

Before(async () => {
  await setTimeout(() => {
    cy.log('Before');
  }, 1000)
});

After(() => {
  cy.log('After');
});

Given('I open the App', () => {
  // Placeholder
});

Then('It loads fine', () => {
  cy.visit('');
});
