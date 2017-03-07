'use babel';

import { EventEmitter } from 'events';
import { platform} from 'os';
import { spawnSync } from 'child_process';

// Package settings
import meta from '../package.json';

export const config = {
  customArguments: {
    title: 'Custom Arguments',
    description: 'Specify your preferred arguments for `stylus`, supports [replacement](https://github.com/noseglid/atom-build#replacement) placeholders',
    type: 'string',
    'default': '{FILE_ACTIVE} --out {FILE_ACTIVE_NAME_BASE}.css',
    order: 0
  },
  manageDependencies: {
    title: 'Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 1
  },
  alwaysEligible: {
    title: 'Always Eligible',
    description: 'The build provider will be available in your project, even when not eligible',
    type: 'boolean',
    default: false,
    order: 2
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get(meta.name + '.manageDependencies') && !atom.inSpecMode()) {
    this.satisfyDependencies();
  }
}
export function which() {
  if (platform() === 'win32') {
    return 'where';
  }
  return 'which';
}

export function satisfyDependencies() {
  let k;
  let v;

  require('atom-package-deps').install(meta.name);

  const ref = meta['package-deps'];
  const results = [];

  for (k in ref) {
    if (typeof ref !== 'undefined' && ref !== null) {
      v = ref[k];
      if (atom.packages.isPackageDisabled(v)) {
        if (atom.inDevMode()) {
          console.log('Enabling package \'' + v + '\'');
        }
        results.push(atom.packages.enablePackage(v));
      } else {
        results.push(void 0);
      }
    }
  }
  return results;
}

export function provideBuilder() {
  return class StylusProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe('build-stylus.customArguments', () => this.emit('refresh'));
    }

    getNiceName() {
      return 'Stylus';
    }

    isEligible() {
      if (atom.config.get(meta.name + '.alwaysEligible') === true) {
        return true;
      }

      const cmd = spawnSync(which(), ['stylus']);
      if (!cmd.stdout.toString()) {
        return false;
      }

      return true;
    }

    settings() {
      const errorMatch = [
        '(?<message>.*Error): (?<file>.+):(?<line>\\d+):(?<col>\\d+)\\n'
      ];

      // User settings
      const customArguments = atom.config.get(meta.name + '.customArguments').trim().split(' ');

      return [
        {
          name: 'Stylus',
          exec: 'stylus',
          args: [ '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile',
          errorMatch: errorMatch
        },
        {
          name: 'Stylus (sourcemap)',
          exec: 'stylus',
          args: [ '--sourcemap', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-with-sourcemap',
          errorMatch: errorMatch
        },
        {
          name: 'Stylus (compress)',
          exec: 'stylus',
          args: [ '--compress', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.min.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-compressed',
          errorMatch: errorMatch
        },
        {
          name: 'Stylus (compress, sourcemap)',
          exec: 'stylus',
          args: [ '--compress', '--sourcemap', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.min.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-compressed-with-sourcemap',
          errorMatch: errorMatch
        },
        {
          name: 'Stylus (user)',
          exec: 'stylus',
          args: customArguments,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-compressed-with-sourcemap',
          errorMatch: errorMatch
        },
        {
          name: 'Watch Stylus',
          exec: 'stylus',
          args: [ '--watch', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:watch-and-compile',
          errorMatch: errorMatch
        },
        {
          name: 'Watch Stylus (compress)',
          exec: 'stylus',
          args: [ '--compress', '--watch', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.min.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:watch-and-compile-compressed',
          errorMatch: errorMatch
        }
      ];
    }
  };
}
