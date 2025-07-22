# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/62045c33-ed7e-4425-bccf-8fea842a5a61

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/62045c33-ed7e-4425-bccf-8fea842a5a61) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Using Docker

This project includes Docker support for easy deployment. You can either build the Docker image locally or pull the pre-built image from GitHub Container Registry.

#### Option 1: Build locally

```sh
# Build the Docker image
docker build -t neovim-resume .

# Run the container
docker run -p 8080:8080 neovim-resume
```

#### Option 2: Pull from GitHub Container Registry

```sh
# Pull the latest image
docker pull ghcr.io/OWNER/neovim-resume:latest

# Run the container
docker run -p 8080:8080 ghcr.io/OWNER/neovim-resume:latest
```

Replace `OWNER` with the GitHub username or organization that owns this repository.

The application will be available at http://localhost:8080

#### CI/CD with GitHub Actions

This project uses GitHub Actions to automatically build and publish the Docker image to GitHub Container Registry whenever changes are pushed to the main branch. The workflow:

1. Builds and tests the application
2. Builds the Docker image
3. Pushes the image to GitHub Container Registry (ghcr.io)

You can view the workflow configuration in [.github/workflows/docker-build-publish.yml](./.github/workflows/docker-build-publish.yml).

For detailed information about the Docker setup, including production considerations, see [Docker Setup Documentation](./docs/docker-setup.md).

### Using Lovable

Simply open [Lovable](https://lovable.dev/projects/62045c33-ed7e-4425-bccf-8fea842a5a61) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
