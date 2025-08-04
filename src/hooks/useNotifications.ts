import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuthContext';
import { useToast } from './use-toast';

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  body?: string;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Mock notifications for now since table is not in types yet
      const mockNotifications: Notification[] = [
        {
          id: 1,
          user_id: user.id,
          title: 'Nouvelle demande de congé',
          body: 'Une nouvelle demande de congé a été soumise',
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          user_id: user.id,
          title: 'Demande approuvée',
          body: 'Votre demande de congé a été approuvée',
          is_read: false,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          user_id: user.id,
          title: 'Rappel',
          body: 'N\'oubliez pas de mettre à jour votre profil',
          is_read: true,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      // Mock update for now
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      // Mock update for now
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};