module.exports = function webpackPostBundleCommands(commands) {
  this.commands = commands;
  this.runCommand = function runCommand(cmd, args) {
    const _this = this;
    setTimeout(function timeoutQue() {
      var response = '';

      console.log('\nRunning Post Bundle Command: ' + cmd);

      const spawn = require('child_process').spawn;
      const child = spawn(cmd, args, {
        detached: true,
        env: process.env
      });

      child.stdout.on('data', function childOnStdout(data) {
        response += data.toString();
      });

      child.on('close', function childOnClose() {
        console.log(response);
        _this.nextCommand();
      });

      child.unref();
    }, 1);
  };

  this.nextCommand = function nextCommand() {
    if (typeof this.commands === 'object') {
      const command = this.commands.shift();
      if (command && typeof command === 'object') {
        this.runCommand(command[0], command[1]);
      } else if (command) {
        this.runCommand(command, []);
      }
    }
  };

  this.apply = function apply(compiler) {
    compiler.plugin('done', function compilerDone() {
      this.nextCommand();
    }.bind(this));
  };
};
