/**
 * Enum containing tasklet types
 */
export enum TaskletType {

  UNSPECIFIED = '???',
  // Action
  ACTION = 'Action',
  TRAVEL = 'Travel',
  POMODORO = 'Pomodoro',
  // Communication
  CALL = 'Call',
  MEETING = 'Meeting',
  MAIL = 'Mail',
  CHAT = 'Chat',
  DAILY_SCRUM = 'Daily Scrum',
  // Development
  DEVELOPMENT = 'Development', // deprecated
  CODING = 'Coding',
  DEBUGGING = 'Debugging',
  DOCUMENTATION = 'Documentation',
  REVIEW = 'Review',
  TESTING = 'Testing',
  // Idea
  IDEA = 'Idea',
  // Break
  LUNCH_BREAK = 'Lunch Break',
  POMODORO_BREAK = 'Pomodoro Break',
  COMMUTE = 'Commute',
  FINISHING_TIME = 'Finishing Time'
}
