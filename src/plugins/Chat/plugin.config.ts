import type { PluginConfig } from '../../pluginRegistry';

const config: PluginConfig = {
  name: 'Chat',
  enabled: true,
  loader: () => import('./index'),
};

export default config;
