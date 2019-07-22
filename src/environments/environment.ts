// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

/**
 * Environment settings for development environment
 */
export const environment = {
  production: false,
  APP_NAME: 'Basalt Dev',
  DATABASE_ENTITIES: 'basalt-dev',
  DATABASE_SETTINGS: 'basalt_settings-dev',

  LIMIT_TASKLETS_COUNT: 1000,
  LIMIT_TASKS_COUNT: 1000,
  LIMIT_PROJECTS_COUNT: 50,
  LIMIT_TAGS_COUNT: 500,
  LIMIT_PERSONS_COUNT: 500,

  LIMIT_TASKLETS_DAYS: 45,
  LIMIT_TASKS_DAYS: 600,
  LIMIT_PROJECTS_DAYS: 600,
  LIMIT_TAGS_DAYS: 600,
  LIMIT_PERSONS_DAYS: 600,

  FEATURE_TOGGLE_SUGGESTED_ACTIONS: true,
  FEATURE_TOGGLE_SCOPE: false,
  FEATURE_TOGGLE_SCRUM: true,
  FEATURE_TOGGLE_DEVELOPMENT: true,

  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
