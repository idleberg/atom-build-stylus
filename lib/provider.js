'use babel';

const self = '[build-stylus] ';
const debug = atom.config.get('build-stylus.debug');

import {exec} from 'child_process';

export function provideBuilder() {
  return class StylusProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Stylus';
    }

    isEligible() {
      exec('stylus --version', function (error, stdout, stderr) {
        if (error !== null) {
          if (debug === true) console.log(self + error);
          // No stylus installed
          return false;
        }
        if (debug === true) console.log(self + stdout);
      });
      // Let's go!
      return true;
    }

    settings() {

      return [
        {
          name: 'Stylus',
          exec: 'stylus',
          args: [ '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile'
        },
        {
          name: 'Stylus (sourcemap)',
          exec: 'stylus',
          args: [ '--sourcemap', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-with-sourcemap'
        },
        {
          name: 'Stylus (compress)',
          exec: 'stylus',
          args: [ '--compress', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.min.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-compressed'
        },
        {
          name: 'Stylus (compress, sourcemap)',
          exec: 'stylus',
          args: [ '--compress', '--sourcemap', '{FILE_ACTIVE}', '--out', '{FILE_ACTIVE_NAME_BASE}.min.css' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'stylus:compile-compressed-with-sourcemap'
        }
      ];
    }
  };
}
