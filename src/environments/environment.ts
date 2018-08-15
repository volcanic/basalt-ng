// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  DATABASE_ENTITIES: 'basalt-dev',
  DATABASE_SETTINGS: 'basalt_settings-dev',
  LIMIT_PROJECTS: 50,
  LIMIT_TASKS: 500,
  LIMIT_TASKLETS: 100,
  LIMIT_PERSONS: 100,
  LIMIT_TAGS: 100,
  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
