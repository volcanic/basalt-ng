// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

/**
 * Environment settings for development environment
 * @type {{production: boolean; APP_NAME: string; DATABASE_ENTITIES: string; DATABASE_SETTINGS: string; LIMIT_PROJECTS_COUNT: number; LIMIT_TASKS_COUNT: number; LIMIT_TASKLETS_COUNT: number; LIMIT_PERSONS_COUNT: number; LIMIT_TAGS_COUNT: number; NAME: any; VERSION: any; LICENSE: string | any; HOMEPAGE: string | any; TAGS: any}}
 */
export const environment = {
  production: false,
  APP_NAME: 'Basalt Dev',
  DATABASE_ENTITIES: 'basalt-dev',
  DATABASE_SETTINGS: 'basalt_settings-dev',

  LIMIT_TASKLETS_COUNT: 500,
  LIMIT_TASKS_COUNT: 500,
  LIMIT_PROJECTS_COUNT: 50,
  LIMIT_TAGS_COUNT: 500,
  LIMIT_PERSONS_COUNT: 500,

  LIMIT_TASKLETS_DAYS: 45,
  LIMIT_TASKS_DAYS: 60,
  LIMIT_PROJECTS_DAYS: 600,
  LIMIT_TAGS_DAYS: 60,
  LIMIT_PERSONS_DAYS: 60,

  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
