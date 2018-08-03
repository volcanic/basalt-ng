export const environment = {
  production: true,
  DATABASE_ENTITIES: 'basalt',
  DATABASE_SETTINGS: 'basalt_settings',
  LIMIT_PROJECTS: 50,
  LIMIT_TASKS: 50,
  LIMIT_TASKLETS: 100,
  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
