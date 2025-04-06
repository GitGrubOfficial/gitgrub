from pathlib import Path

from git import Actor, Repo

GIT_REPO_PATH = Path("/app/recipe_git_repo")

# we need this repo path because this is where all changes are saved and track the changes through git
# can change this later

def make_sure_git_repo_exist():
    if not GIT_REPO_PATH.exists():
        GIT_REPO_PATH.mkdir(parents=True)
    if not (GIT_REPO_PATH / ".git").exists():
        Repo.init(GIT_REPO_PATH)
    return Repo(GIT_REPO_PATH)


def save_recipe_markdown(recipe):
    repo = make_sure_git_repo_exist()

    username = recipe.owner.username if recipe.owner else "unknown"
    filename = f"recipes/{username}/{recipe.title.replace(' ', '_').lower()}.md"
    file_path = GIT_REPO_PATH / filename
    file_path.parent.mkdir(parents=True, exist_ok=True)

    content = f"# {recipe.title}\n\n"
    content += f"**Ingredients**:\n{recipe.ingredients}\n\n"
    content += f"**Instructions**:\n{recipe.instructions}\n"

    with open(file_path, "w") as f:
        f.write(content)

    repo.index.add([str(file_path.relative_to(GIT_REPO_PATH))])
    author = Actor(recipe.owner.username, "tuan@gitgrubhub.local")
    commit_message = f"Add/Update recipe: {recipe.title} by {recipe.owner.username}"
    commit = repo.index.commit(commit_message, author=author)

    return commit.hexsha

def get_recipe_diff_hash_base(recipe):
    repo = make_sure_git_repo_exist()

    commit_hash = recipe.git_commit_hash
    if not commit_hash:
        return "This recipe has no change history"

    commit = repo.commit(commit_hash)
    parents = commit.parents

    if not parents:
        return "This recipe is the orignal copy"

    username = recipe.owner.username if recipe.owner else "unknown"
    filename = f"recipes/{username}/{recipe.title.replace(' ', '_').lower()}.md"


    try:
        diff_output = repo.git.diff(parents[0].hexsha, commit.hexsha, filename)
        if not diff_output.strip():
            return "No changes detected in file"
        return diff_output
    except Exception as e:
        return f"Error while generating diff: {str(e)}"

    return "No diff found"