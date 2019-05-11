import { TaskManager, Location } from 'expo';
import { Alert } from 'react-native';
import store from '../store';

TaskManager.defineTask('geofence', ({data, error}) => {
  if (error) return;

  const { eventType } = data;
  if (eventType === Location.GeofencingEventType.Enter) {

    let tasks = store.getState().game.tasks;

    Alert.alert(
      `You found it!`,
      `Entered ${tasks.filter(task => task.id === Number(data.region.identifier))[0].name}`,
      [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      }],
      { cancelable: true }
    );
    // insert thunk here that takes identifier (event id);
  }
  // else if (eventType === Location.GeofencingEventType.Exit) {

  // }
});

export default TaskManager;
