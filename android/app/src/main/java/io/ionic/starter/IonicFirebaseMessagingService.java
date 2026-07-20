package io.ionic.starter;

import androidx.annotation.NonNull;

import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.useinsider.insider.Insider;

/**
 * Created a custom service because the default Capacitor push notification plugin
 * does not trigger push events when the app is in the killed state.
 * https://capacitorjs.com/docs/apis/push-notifications#android-1
 */
public class IonicFirebaseMessagingService extends FirebaseMessagingService {
  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    super.onMessageReceived(remoteMessage);

    if (remoteMessage != null && remoteMessage.getData().containsKey("source") && remoteMessage.getData().get("source").equals("Insider")) {
      Insider.Instance.handleFCMNotification(getApplicationContext(), remoteMessage);
      return;
    }

    // To ensure the default Capacitor events continue to work, you need to integrate this method.
    PushNotificationsPlugin.sendRemoteMessage(remoteMessage);
  }

  @Override
  public void onNewToken(@NonNull String token) {
    super.onNewToken(token);

    // To ensure the default Capacitor events continue to work, you need to integrate this method.
    PushNotificationsPlugin.onNewToken(token);
  }
}
