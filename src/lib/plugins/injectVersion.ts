import { readFileSync } from 'fs';
import { join } from 'path';

export function getVersionFromPackageJson(): string {
  const packageJsonPath = join(__dirname, '../../../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  return packageJson.version;
}

export function injectNPMPackageVersion(version: string) {
  return {
    name: 'inject-version',
    config: () => {
      return {
        define: {
          __APP_VERSION__: JSON.stringify(version),
        },
      };
    },
  };
}
