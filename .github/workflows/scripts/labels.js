// This script is used to add labels to pull requests based on the title of the pull request.
// The title of the pull request is checked for specific keywords and based on the keyword, a label is added
// to the pull request. If the label does not exist, it is created and then added to the pull request.
module.exports = async ({ github, context }) => {
    const title = context.payload.pull_request.title.toLowerCase();
    if (!title) return;

    const regex = /^(fix|feat|build|docs|test)(\((\w+)\))?(!)?:\s.+$/;
    const match = title.match(regex);
    if (!match) return;

    const type = match[1];
    const breaking = match[4] === "!";

    const config = {
        "fix": { name: "fix", description: "Fixes specific bug or issue", color: "FF1938" },
        "feat": { name: "feature", description: "Adds new features", color: "00EEBC" },
        "build": { name: "build", description: "Updates in build components", color: "04103A" },
        "docs": { name: "documentation", description: "Documentation updates", color: "19ABFF" },
        "test": { name: "test", description: "Test suite changes", color: "EBF0F6" }
    };

    let labels = [];
    if (!config[type]) return;
    labels.push(config[type]);

    if (breaking) {
        labels.push({ name: "breaking change", description: "Introduces significant changes", color: "FFE019" });
    }

    const existing = await github.rest.issues.listLabelsForRepo({
        owner: context.repo.owner,
        repo: context.repo.repo,
    });

    for (const label of labels) {
        const exists = existing.data.some(data => data.name === label.name);
        if (!exists) {
            await github.rest.issues.createLabel({
                owner: context.repo.owner,
                repo: context.repo.repo,
                name: label.name,
                color: label.color,
                description: label.description,
            });
        }
    }

    await github.rest.issues.addLabels({
        issue_number: context.payload.pull_request.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        labels: labels.map(label => label.name),
    });
};