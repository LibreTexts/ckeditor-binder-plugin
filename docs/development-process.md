# Development Process

This documentation describes the development process of this plugin starting from setup to production deployment.

## Setup

The default branch of this repo is staging. To setup, run:

```
yarn install
```

To open a development server, run:

```
yarn start
```

> Dev server will be running at [http://localhost:8080](http://localhost:8080).

## Development

Our development process is as follow:

1. Create a new branch from staging
2. Write code
3. Push your branch to github (never push to any other branch unless necessary)
4. Create a pull request to merge to staging
5. Request someone on the team to approve
6. Rebase your branch to staging and force push

### How to Get Your PR Merged

There are two requirements for your PR to be merged:

#### 1. Linter

All of your code needs to pass the linter. Our linter follows the [airbnb javascript guide](https://github.com/airbnb/javascript). If you have any questions on why each restriction is set, please refer to their documentation. Our linter is built into webpack so you should be able to know whether you will pass the linter by a simple look at the server log.

> You can also manually run `yarn lint` to make sure.

#### 2. Code Review

All PRs are required to at least be reviewed and approved by another member on the team.

### Rebase

No PR is guaranteed to merge on github without conflict. To ensure there is no conflict and also make branch graphs more clear, a rebase is recommended before merging any code. You can rebase by running:

```
git checkout your-branch && git rebase staging
```

## Deploy Staging

After PR is merged, the code is ready to go on staging. To deploy, run:

```
bin/deploy.sh
```

This will be deployed to our staging site [https://query.libretexts.org](https://query.libretexts.org).

> The code is deployed to test.libretexts.org which is our test file server. You will need to have your ssh public key on the server to run the script.

## Production

When everything is ready to go, we can now deploy to production. There is a github action set up so that anything merged to the master branch will be deployed to production. So all we need is:

1. Create a PR to merge staging to master
2. Request approval from another team member
3. Tag a new version number to the latest commit on master
4. Add a release note to /release/{version}.md with all the related PRs included

