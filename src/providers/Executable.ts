import Utils = require('../Utils');
import i = require('../Interfaces');
import _ = require('lodash')


class Executable implements i.AutocompletionProvider {
    private paths: Array<string> = process.env.PATH.split(':');
    private executables: string[] = [];

    constructor() {
        this.paths.forEach((path) => {
            Utils.filesIn(path, (files) => {
                var executableNames = files.map((fileName) => {
                    return fileName.split('/').pop();
                });

                this.executables = this.executables.concat(executableNames);
            })
        });
    }

    getSuggestions(currentDirectory: string, input: i.Parsable) {
        return new Promise((resolve) => {
            if (input.getLexemes().length > 1) {
                return resolve([]);
            }

            var filtered = _.filter(this.executables, (executable: string) => {
                return executable.startsWith(input.getLastLexeme());
            });

            resolve(_.map(filtered, (executable: string) => {
                return {
                    value: executable,
                    priority: 0,
                    synopsis: '',
                    description: '',
                    type: 'executable'
                };
            }));
        });
    }
}

export = Executable;