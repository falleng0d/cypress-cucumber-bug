export function getSetupAndTeardownTasks() {
  return {
    async 'data:setup'() {
      return await setup();
    },
    async 'data:teardown'() {
      return await teardown();
    },
  };
}

async function setup() {
  await setTimeout(() => {
    console.log('setup');
  }, 1000);
  return true;
}

async function teardown() {
  await setTimeout(() => {
    console.log('teardown');
  }, 1000);
  return true;
}
