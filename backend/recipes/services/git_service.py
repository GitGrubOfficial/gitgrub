from pathlib import Path

from git import Actor, Repo
import re
GIT_REPO_PATH = Path("/app/recipe_git_repo")

# we need this repo path because this is where all changes are saved and track the changes through git
# can change this later

def make_sure_git_repo_exist():
    if not GIT_REPO_PATH.exists():
        GIT_REPO_PATH.mkdir(parents=True)
    if not (GIT_REPO_PATH / ".git").exists():
        Repo.init(GIT_REPO_PATH)
    return Repo(GIT_REPO_PATH)

def sanitize_email_for_folder(email):
    return re.sub(r'[^a-zA-Z0-9_\-]', '_', email)

def get_display_name(user):
    if not user:
        return "Unknown"

    name = f"{user.first_name} {user.last_name}".strip()
    return name if name else "Unknown"


def save_recipe_markdown(recipe, change_description=None):
    repo = make_sure_git_repo_exist()

    if recipe.owner and recipe.owner.email:
        user_folder = sanitize_email_for_folder(recipe.owner.email)
    else:
        user_folder = "unknown"
    filename = f"recipes/{user_folder}/{recipe.title.replace(' ', '_').lower()}.md"
    file_path = GIT_REPO_PATH / filename
    file_path.parent.mkdir(parents=True, exist_ok=True)

    content = "[metadata]\n"
    content += f"Title: {recipe.title}\n"
    content += f"Prep Time: {recipe.prep_time or 'N/A'} minutes\n"
    content += f"Cook Time: {recipe.cook_time or 'N/A'} minutes\n"
    content += f"Servings: {recipe.servings or 'N/A'}\n"
    content += f"Difficulty: {recipe.get_difficulty_display() if recipe.difficulty else 'N/A'}\n"
    content += f"Visibility: {recipe.get_visibility_display() if recipe.visibility else 'N/A'}\n"
    content += "\n"
    content += f"# {recipe.title}\n\n"
    content += f"**Ingredients**:\n{recipe.ingredients}\n\n"
    content += f"**Instructions**:\n{recipe.instructions}\n"

    with open(file_path, "w") as f:
        f.write(content)

    repo.index.add([str(file_path.relative_to(GIT_REPO_PATH))])
    author_name = get_display_name(recipe.owner)
    author = Actor(author_name, recipe.owner.email)
    commit_message = (
        f"{change_description} for {recipe.title} by {author_name}"
        if change_description
        else f"Update: {recipe.title} by {author_name}"
    )
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

    if recipe.owner and recipe.owner.email:
        user_folder = sanitize_email_for_folder(recipe.owner.email)
    else:
        user_folder = "unknown"
    filename = f"recipes/{user_folder}/{recipe.title.replace(' ', '_').lower()}.md"


    try:
        diff_output = repo.git.diff(parents[0].hexsha, commit.hexsha, filename)
        if not diff_output.strip():
            return "No changes detected in file"
        return diff_output
    except Exception as e:
        return f"Error while generating diff: {str(e)}"

    return "No diff found"