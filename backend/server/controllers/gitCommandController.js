const fs = require("fs").promises;
const path = require("path");
// const { v4: uuidv4 } = require("uuid");
const {s3, s3Bucket} = require("../../config/aws-config");
// used for hiding folder on Windows
const { exec } = require("child_process");

const uuidv4 = async () => {
  const { v4 } = await import("uuid");
  return v4();
};


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

const commitChanges = async (message) => {
    const repoPath = path.resolve(process.cwd(), ".mygitrepo")
    const stagedPath = path.join(repoPath, "staged")
    const commitsPath = path.join(repoPath, "commits")
    try{
        const commitId = await uuidv4()
        // console.log("Generated commit ID:", commitId);
        const commitDir = path.join(commitsPath, commitId)
        await fs.mkdir(commitDir, {recursive: true})
        const files = await fs.readdir(stagedPath)

        for(const file of files){
            await fs.copyFile(path.join(stagedPath, file), path.join(commitDir, file))
        }

        await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({
                message,
                timestamp : new Date().toISOString(),
                commitId
            })
        )
        console.log(`Changes committed in ${commitId} with message: ${message}`);

    }catch(err){
        console.error("Error committing changes:", err);
    }

}

const pushFiles = async () => {
    const repoPath = path.resolve(process.cwd(), ".mygitrepo")
    const commitsPath = path.join(repoPath, "commits")
    try{
        const commitDirs = await fs.readdir(commitsPath)
        for(const commitDir of commitDirs){
            const commitPath = path.join(commitsPath, commitDir)
            const files = await fs.readdir(commitPath)

            for(const file of files){
                const filePath = path.join(commitPath, file)
                const fileContent = await fs.readFile(filePath)
                const params = {
                    Bucket: s3Bucket,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent
                }
                await s3.upload(params).promise()
                console.log(`Uploaded ${file} from commit ${commitDir} to S3`);
            }
        }
    }catch(err){
        console.error("Error pushing files to S3:", err);
    }
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