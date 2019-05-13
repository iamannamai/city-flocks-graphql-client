export const defaultUser = {};
export const defaultEvent = {
  allEvents: [],
  // stores array of event_team objects relevant to my team
  myEvents: [],
  // stores array of just eventIds from myEvents
  myEventIds: [],
  selectedEventId: 0,
  myActiveEvent: {}
};
export const defaultGame = {
  eventId: 0,
  eventTeamId: 0,
  tasks: [],
  teamTasks: [],
  teamTasksRemaining: 9999,
  teammates: [],
  endTime: Date.now()
};
export const defaultTeam = {
  myTeam: {},
  potentialTeammates: []
};
