// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

/**
 * Environment settings for development environment
 * @type {{production: boolean; APP_NAME: string; DATABASE_ENTITIES: string; DATABASE_SETTINGS: string; LIMIT_PROJECTS: number; LIMIT_TASKS: number; LIMIT_TASKLETS: number; LIMIT_PERSONS: number; LIMIT_TAGS: number; NAME: any; VERSION: any; LICENSE: string | any; HOMEPAGE: string | any; TAGS: any}}
 */
export const environment = {
  production: false,
  APP_NAME: 'Basalt Dev',
  DATABASE_ENTITIES: 'basalt-dev2',
  DATABASE_SETTINGS: 'basalt_settings-dev2',
  LIMIT_PROJECTS: 50,
  LIMIT_TASKS: 500,
  LIMIT_TASKLETS: 500,
  LIMIT_PERSONS: 500,
  LIMIT_TAGS: 100,
  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
