import { TaskManager, Location } from 'expo';
import { Alert } from 'react-native';
import store, { completeTaskThunk } from '../store';

export const GEOFENCE_TASKNAME = 'GEOFENCE';

TaskManager.defineTask(GEOFENCE_TASKNAME, ({data, error}) => {
  if (error) return;

  const { eventType } = data;
  if (eventType === Location.GeofencingEventType.Enter) {

    const {tasks, teamTasks, eventTeamId} = store.getState().game;
    const taskId = parseInt(data.region.identifier, 10);

    // Determine if task was already completed. If not, dispatch thunk to complete task
    if (!isCompleted(teamTasks, taskId)) {
      Alert.alert(
        `You found it!`,
        `Entered ${tasks.filter(task => task.id === taskId)[0].name}`,
        [
          {
            text: 'Complete Task',
            onPress: () => dispatchCompleteTask(eventTeamId, taskId),
            style: 'cancel',
          },
          {
            text: 'Dismiss',
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    }
  }
});

const isCompleted = (teamTasks, taskId) => {
  return teamTasks.find(task => task.taskId === taskId).completed;
};

const dispatchCompleteTask = (eventTeamId, taskId) => {
  store.dispatch(completeTaskThunk(eventTeamId, taskId));
};

export default TaskManager;
