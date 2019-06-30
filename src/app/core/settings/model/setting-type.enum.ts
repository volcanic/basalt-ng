/**
 * Enum of setting types
 */
export enum SettingType {
  //
  // Version
  //

  VERSION = 'version',

  //
  // Features
  //

  // Development
  DEVELOPMENT = 'development',
  // Scrum
  SCRUM = 'scrum',
  // Pomodoro
  POMODORO = 'pomodoro',
  POMODORO_DURATION = 'pomodoro-duration',
  POMODORO_BREAK = 'pomodoro-break',
  // Helper
  SEMAPHORE_FEATURE = 'helper-feature',

  //
  // Preferences
  //

  TIMELINE_SIDENAV_OPENED = 'timeline-sidenav-opened',
  TASKLET_SIDENAV_OPENED = 'tasklet-sidenav-opened',
  TASK_SIDENAV_OPENED = 'task-sidenav-opened'
}
