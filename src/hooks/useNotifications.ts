import { useState, useEffect, useCallback } from 'react';
import { getToken, onMessage, type Messaging } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { db, getMessagingInstance, VAPID_KEY } from '../config/firebase';

interface UseNotificationsOptions {
  userId?: string;
}

interface UseNotificationsReturn {
  permission: NotificationPermission | 'unsupported';
  token: string | null;
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
}

export function useNotifications({ userId }: UseNotificationsOptions): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);

  // Initialize messaging
  useEffect(() => {
    const init = async () => {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        setPermission('unsupported');
        return;
      }

      setPermission(Notification.permission);

      const messagingInstance = await getMessagingInstance();
      setMessaging(messagingInstance);
    };

    init();
  }, []);

  // Set up foreground message handler
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);

      // Show a notification even when app is in foreground
      if (Notification.permission === 'granted' && payload.notification) {
        const { title, body } = payload.notification;
        new Notification(title || 'New Message', {
          body: body || 'You have a new message',
          icon: './icons/icon-192.svg',
          tag: 'cmail-foreground',
        });
      }
    });

    return () => unsubscribe();
  }, [messaging]);

  // Save token to Firestore when we have both userId and token
  useEffect(() => {
    if (userId && token) {
      setDoc(
        doc(db, 'duoboard_users', userId),
        { fcmToken: token },
        { merge: true }
      ).catch((err) => {
        console.error('Error saving FCM token:', err);
      });
    }
  }, [userId, token]);

  const requestPermission = useCallback(async () => {
    if (!messaging) {
      setError('Push notifications are not supported in this browser');
      return;
    }

    if (VAPID_KEY === 'YOUR_VAPID_KEY_HERE') {
      setError('VAPID key not configured. See Firebase Console > Cloud Messaging.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Request notification permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // Register service worker if not already registered
        const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);

        // Get FCM token
        const fcmToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
          setToken(fcmToken);
        } else {
          setError('Failed to get notification token');
        }
      } else if (result === 'denied') {
        setError('Notification permission denied');
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      setError('Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  }, [messaging]);

  return {
    permission,
    token,
    loading,
    error,
    requestPermission,
  };
}
