import React, { Suspense } from 'react';
import pluginRegistry from './pluginRegistry';

const PluginsManager: React.FC = () => (
  <Suspense fallback={null}>
    {pluginRegistry
      .filter((plugin) => plugin.enabled)
      .map((plugin) => {
        const Component = React.lazy(plugin.loader);
        return <Component key={plugin.name} />;
      })}
  </Suspense>
);

export default PluginsManager;
