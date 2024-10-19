import meowHelp from 'cli-meow-help';
import meow from 'meow';

class CLI {
    constructor() {
        this.flags = {
            clear: { type: `boolean`, default: false, shortFlag: `c`, desc: `Clear the console` },
            debug: { type: `boolean`, default: false, shortFlag: `d`, desc: `Print debug info` },
        };

        this.commands = {
            help: { desc: `Print help info` }
        };

        this.helpText = meowHelp({
            name: `calai`,
            flags: this.flags,
            commands: this.commands
        });

        this.options = {
            importMeta: import.meta,
            inferType: true,
            description: false,
            hardRejection: false,
            flags: this.flags
        };
    }

    getMeowInstance() {
        return meow(this.helpText, this.options);
    }
}

export default CLI;