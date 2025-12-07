const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { initRepo, addFiles, commitChanges, pullFiles, pushFiles, revertToCommit } = require('./server/controllers/gitCommandController');

yargs(hideBin(process.argv))
    .command("init", "Initialize the repository", {}, initRepo)
    .command("add <file>", "Add a file to repository",
        (yargs) => {
            yargs.positional("file", {
                describe: "File to add to repository",
                type: "string"
            })
        }
        , (argv)=>{ addFiles(argv.file)})
    .command("commit <message>", "commit changes to repository",
        (yargs) => {
            yargs.positional("message", {
                describe: "commit message",
                type: "string"
            })
        }, (argv)=>{ commitChanges(argv.message)})
    .command("push", "push files to s3", {}, pushFiles)
    .command("pull", "pull files to s3", {}, pullFiles)
    .command("revert <commitId>", "revert to specific commit",
        (yargs) => {
            yargs.positional("commitId", {
                describe: "revert files",
                type: "string"
            })
        }, revertToCommit)
    .demandCommand(1, "you need at least one command before movin on")
    .help().argv