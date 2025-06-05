
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function NotificationCenter() {
  const [notifications] = useState([
    {
      id: 1,
      type: 'info' as const,
      title: 'Sistema atualizado',
      message: 'Nova versão do sistema disponível',
      time: '2 min atrás',
      read: false
    },
    {
      id: 2,
      type: 'success' as const,
      title: 'Backup concluído',
      message: 'Backup dos dados realizado com sucesso',
      time: '1 hora atrás',
      read: false
    },
    {
      id: 3,
      type: 'warning' as const,
      title: 'Manutenção programada',
      message: 'Sistema será atualizado hoje às 22h',
      time: '3 horas atrás',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-xl w-10 h-10 hover:bg-slate-100 relative"
        >
          <Bell className="h-5 w-5 text-slate-500" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500 hover:bg-red-500"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-semibold">
          Notificações
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} novas
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.map((notification) => (
          <DropdownMenuItem 
            key={notification.id}
            className="flex items-start gap-3 p-4 cursor-pointer"
          >
            {getIcon(notification.type)}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-slate-500">{notification.message}</p>
              <p className="text-xs text-slate-400">{notification.time}</p>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-sm text-blue-600 hover:text-blue-700">
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
