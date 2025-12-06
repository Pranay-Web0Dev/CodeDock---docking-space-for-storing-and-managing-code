const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");


const initRepo = async () => {
    const repoPath = path.resolve(process.cwd(), ".mygitrepo");
    const commitsPath = path.join(repoPath, "commits");

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitsPath, { recursive: true });

        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({
                bucket: process.env.S3_BUCKET || "default-bucket"
            }, null, 2)
        );

        // Hide folder on Windows
        if (process.platform === "win32") {
            exec(`attrib +h "${repoPath}"`);
        }

        console.log("Repository initialized");
    } catch (err) {
        console.error("Error initializing repository:", err);
    }
};


const addFiles = async (argv) => {
    const file = argv.file;
    console.log(`File ${file} added to repository`);
}

const commitChanges = async (argv) => {
    const message = argv.message;
    console.log(`Changes committed with message: ${message}`);
}

const pushFiles = async () => {
    console.log("Files pushed to S3");
}

const pullFiles = async () => {
    console.log("Files pulled from S3");
}

const revertToCommit = async (argv) => {
    const commitId = argv.commitId;
    console.log(`Reverted to commit: ${commitId}`);
}

module.exports = {
    initRepo,
    addFiles,
    commitChanges,
    pushFiles,
    pullFiles,
    revertToCommit

};