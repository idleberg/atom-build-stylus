'use babel';

const self = '[build-tclsh] ';
const debug = atom.config.get('build-tclsh.debug');

import {exec} from 'child_process';

export function provideBuilder() {
  return class TclshProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Tcl';
    }

    isEligible() {
      exec('which tclsh', function (error, stdout, stderr) {
        if (error !== null) {
          if (debug === true) console.log(self + error);
          // No tclsh installed
          return false;
        }
        if (debug === true) console.log(self + stdout);
      });
      // Let's go!
      return true;
    }

    settings() {
      const errorMatch = [
      ];

      return [
        {
          name: 'tclsh',
          exec: 'tclsh',
          args: [ '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'tclsh:run',
        }
      ];
    }
  };
}
