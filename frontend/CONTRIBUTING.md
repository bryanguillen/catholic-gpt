# Contributing to Catholic GPT Frontend

Thank you for your interest in contributing to **Catholic GPT**! This project is in its early stages, and we're excited to welcome developers who want to help build a user-friendly Catholic AI experience or who just want to "hack away" and have some fun.

This document outlines some basic guidelines for contributing to the **frontend** portion of the project.

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Code Guidelines](#code-guidelines)
- [Branching and Pull Requests](#branching-and-pull-requests)
- [Project Governance](#project-governance)
- [Communication](#communication)
- [Contributor Expectations](#contributor-expectations)

## Getting Started

### Backend

When working on the `frontend`, you'll want to run the `backend` service, too. The simplest way to do this would be to run it using `docker-compose`. Otherwise, you can run it from scratch as you would any other `NestJS` app. For more on this, please refer to the [backend README.md](../backend/README.md) file.

### Frontend

Once you've got the backend running, you'll want to ensure you follow the steps below:

1. **Fork the Repository** – Create your own copy of the repo under your GitHub account.
2. **Clone Your Fork** – Bring the code to your local machine.
3. **Install Dependencies** – Run:
    ```bash
    npm install
    ```
4. **Run the App** – Start the development server:
    ```bash
    npm run dev
    ```
__Note: The relevant `npm` commands can also found in the `README`.__

## How to Contribute

### Issues

- Check the **Issues** tab for open tasks or bugs
- Only the project lead maintainer can open issues; if you have ideas you'd like to share, please do so in the Discord chat (more below), since this project is in its early stages

## Code Guidelines

- **Language**: TypeScript
- **Framework**: React
- **Styling**: Tailwind CSS (with Shadcn components where applicable)
- **Linting & Formatting**: Please see the `README` for more on this
- **Component Structure**: Prefer small, composable components.
- **Folder Structure**: Follow existing conventions for components, hooks, and utilities.
- **NOTE**: When in doubt, feel free to ask the lead maintainer on the project

## Branching and Pull Requests

- Branch off `main`.
- Use descriptive branch names (e.g., `feature/add-chat-bubbles`, `fix/mobile-navbar`).
- Open a **Draft Pull Request** early if you'd like feedback before finalizing.
- All PRs should:
  - Reference the related issue (if applicable).
  - Include a clear description of the change.
  - Include screenshots if the change is visual.

## Project Governance

🚀 **Who Owns This Project?**

Catholic GPT is a project started and led by Bryan Guillen to build a Catholic AI assistant that can answer question for members (and those curious about the Church) with as much precision as possible.

While this is an open source project, the overall vision, roadmap, and major technical decisions are currently maintained by Bryan for now, until the project gets to a more stable place.

💡 **Who Can Open Issues?**

At this stage of the project, only the project lead will open issues to maintain a clear development roadmap. These will include small feature requests, bugfixes, and internal enhancements (like testing, etc.). Stay tuned for more.

👉 If you have a feature suggestion or bug report, please do one of the following:

* Comment on an existing issue that seems related
* Start a discussion in our Discord (see link below)

🛠️ **Who Can Merge Pull Requests?**

Right now, only the lead project maintainer will merge pull requests. This is to ensure that the overall project vision stays clear for now.

🎯 **What Type of Contributions Are You Looking For?**

As mentioned above, here’s what we are actively accepting:

* ✅ Bug fixes
* ✅ Minor UI/UX improvements
* ✅ Improved tests (if applicable)
* ✅ Documentation improvements

We are not yet accepting:

* ❌ Major feature builds without prior discussion
* ❌ Major refactors, etc.

📅 When Will This Change?

As the project matures, the goal is to open up:

* Public GitHub Issues for all contributors.
* Feature contributions from trusted contributors.
* Ownership of certain parts of the project (e.g., frontend, backend, etc.).

Again, for now, we’re keeping a tight, focused roadmap until the project gains traction.

✅ If you’re interested in shaping the project’s future, join our Discord (see link below) or contribute to any existing and open issue.

## Communication

As mentioned in the `README.md`, you will want to join the [Discord server](https://discord.gg/bAmCr5gu) **once an issue is assigned to you**.

## Contributor Expectations

- Be respectful; don't be rude
- Document your changes when necessary (comments, README updates, etc.).
- When in doubt, ask! We're happy to help.

## Thank You!

This project is in its early stages, so keep this in mind when you contribute. Your feedback on the developer experience will help us get better for future contributors. We appreciate your contributions to **Catholic GPT** and look forward to working together to make this project a valuable resource for the Catholic community.