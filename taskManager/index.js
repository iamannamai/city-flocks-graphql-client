import { TaskManager, Location } from 'expo';
import store from '../store';
import socket, { ENTER_GEOFENCE, EXIT_GEOFENCE } from '../socket';

export const GEOFENCE_TASKNAME = 'GEOFENCE';

TaskManager.defineTask(GEOFENCE_TASKNAME, ({data, error}) => {
  if (error) return;

  const { eventType } = data;
  const { game, user } = store.getState();
  const { tasks, teamTasks, eventTeamId } = game;
  const taskId = parseInt(data.region.identifier, 10);

  if (eventType === Location.GeofencingEventType.Enter) {
    // Upon entering geofence, emit socket event to alert server to location if task has not yet been completed.
    if (!isCompleted(teamTasks, taskId)) {
      console.log("ENTERED GEOFENCEEEEE");
      socket.emit(ENTER_GEOFENCE, {
        eventTeamId,
        geoIdentifier: data.region.identifier,
        username: user.username
      });
    }
  } else {
    // When exiting geofence, emit event to alert server to exit
    socket.emit(EXIT_GEOFENCE, {
      eventTeamId,
      geoIdentifier: data.region.identifier,
      username: user.username
    });
  }
});

const isCompleted = (teamTasks, taskId) => {
  return teamTasks.find(task => task.taskId === taskId).completed;
};

// const dispatchCompleteTask = (eventTeamId, taskId) => {
//   store.dispatch(completeTaskThunk(eventTeamId, taskId));
// };

export default TaskManager;
