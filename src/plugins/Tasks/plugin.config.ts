import type { PluginConfig } from '../../pluginRegistry';

const config: PluginConfig = {
  name: 'Tasks',
  enabled: true,
  loader: () => import('./index'),
};

export default config;
