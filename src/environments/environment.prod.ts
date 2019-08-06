/**
 * Environment settings for production environment
 */
export const environment = {
  production: true,
  APP_NAME: 'Basalt',
  DATABASE_ENTITIES: 'basalt',
  DATABASE_SETTINGS: 'basalt_settings',

  DEBUG_MODE: false,

  LIMIT_TASKLETS_COUNT: 500,
  LIMIT_TASKS_COUNT: 500,
  LIMIT_PROJECTS_COUNT: 50,
  LIMIT_TAGS_COUNT: 500,
  LIMIT_PERSONS_COUNT: 500,

  LIMIT_TASKLETS_DAYS: 60,
  LIMIT_TASKS_DAYS: 60,
  LIMIT_PROJECTS_DAYS: 600,
  LIMIT_TAGS_DAYS: 60,
  LIMIT_PERSONS_DAYS: 60,

  FEATURE_TOGGLE_SUGGESTED_ACTIONS: true,
  FEATURE_TOGGLE_SCOPE: false,
  FEATURE_TOGGLE_SCRUM: false,
  FEATURE_TOGGLE_DEVELOPMENT: true,

  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
