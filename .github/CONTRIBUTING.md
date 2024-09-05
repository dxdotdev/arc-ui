# Welcome to Arc UI contributing guide

Thank you for investing your time in contributing to Arc UI! Any contribution you make will be amazing :sparkles:.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## Setup Local Development Environment

The Arc UI repo is using [bun](https://bun.sh). Make sure you have the [latest version of bun](https://github.com/oven-sh/bun/releases) installed in your system. To run the development server:

1. Clone this repository

2. In the root of this project, run `bun install` to install all of the necessary dependencies

3. To run the development server, run `bun run dev`

4. And follow the instructions in the command

**Obs:** Sometimes Firefox stops updating on changes, to solve this follow the instructions:

1. Close Firefox and stop development server

2. Run the command `bash ./scripts/fix-dev-server.sh`

3. Open Firefox, run development server again and follow instructions normally

## Pull Request Guidelines

- Checkout a topic branch from a base branch (e.g. `main`), and merge back against that branch.

- If adding a new feature:

  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first, and have it approved before working on it.

- If fixing a bug:

  - If you are resolving a special issue, please add the issues number in the PR's description.

  - Provide a detailed description of the bug in the PR. Live demo preferred.

- It's OK to have multiple small commits as you work on the PR. GitHub can automatically squash them before merging.

## Thanks :purple_heart:

Thanks for all your contributions and efforts towards improving Arc UI. We thank you for being part of our :sparkles: community :sparkles:!
