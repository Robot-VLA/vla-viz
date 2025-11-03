import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import type { ConnectionStatus as Status } from '../types';
import { cn } from '../lib/utils';

interface ConnectionStatusProps {
  status: Status;
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const statusConfig = {
    connecting: {
      icon: RefreshCw,
      text: 'Connecting...',
      className: 'text-yellow-500',
      iconClassName: 'animate-spin',
    },
    connected: {
      icon: Wifi,
      text: 'Connected',
      className: 'text-green-500',
      iconClassName: '',
    },
    disconnected: {
      icon: WifiOff,
      text: 'Disconnected',
      className: 'text-gray-500',
      iconClassName: '',
    },
    error: {
      icon: AlertCircle,
      text: 'Error',
      className: 'text-red-500',
      iconClassName: '',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800', config.className)}>
      <Icon className={cn('w-4 h-4', config.iconClassName)} />
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
}
