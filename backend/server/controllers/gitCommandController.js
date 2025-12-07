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


const addFiles = async (filePath) => {
    const repoPath = path.resolve(process.cwd(), ".mygitrepo");
    const stagedPath = path.join(repoPath, "staged")
    try{
        await fs.mkdir(stagedPath, {recursive: true});
        const fileName = path.basename(filePath)
        await fs.copyFile(fileName, path.join(stagedPath, fileName))
        console.log(`File ${fileName} added to staging area`);

    }catch(err){
        console.error("Error adding file:", err);
    }
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