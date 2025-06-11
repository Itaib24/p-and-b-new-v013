import React from 'react';
import chatPlugin from './plugins/Chat/plugin.config';
import tasksPlugin from './plugins/Tasks/plugin.config';
import calendarPlugin from './plugins/Calendar/plugin.config';

export interface PluginConfig {
  name: string;
  enabled: boolean;
  loader: () => Promise<{ default: React.ComponentType<any> }>;
}

const pluginRegistry: PluginConfig[] = [chatPlugin, tasksPlugin, calendarPlugin];

export default pluginRegistry;
