/**
 * Enum containing tasklet types
 */
export enum TaskletType {

  UNSPECIFIED = '???',
  // Action
  ACTION = 'Action',
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
  FINISHING_TIME = 'Finishing Time'
}
