import type { PluginConfig } from '../../pluginRegistry';

const config: PluginConfig = {
  name: 'Calendar',
  enabled: true,
  loader: () => import('./index'),
};

export default config;
