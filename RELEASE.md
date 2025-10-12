# Release Process

This document describes how to publish new versions of `ableton-inspector` to NPM.

## Prerequisites

Before you can publish, you need to set up an NPM access token:

### 1. Create an NPM Access Token

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Click on your profile → "Access Tokens"
3. Click "Generate New Token" → "Granular Access Token"
4. Configure the token:
   - **Token name**: `GitHub Actions - ableton-inspector`
   - **Expiration**: Choose an appropriate duration (e.g., 1 year)
   - **Packages and scopes**: Select the packages:
     - `@owenbush/ableton-inspector`
     - `@owenbush/ableton-inspector-core`
   - **Permissions**: Read and write
5. Click "Generate Token" and copy the token

### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste the NPM token you generated
6. Click "Add secret"

## Publishing a New Release

### Step 1: Update Version Numbers

Update the version in both package.json files:

```bash
# Update core package version
npm version <major|minor|patch> --workspace=@owenbush/ableton-inspector-core

# Update CLI package version (should match core version)
npm version <major|minor|patch> --workspace=@owenbush/ableton-inspector
```

Or manually edit:
- `packages/core/package.json`
- `packages/cli/package.json`

### Step 2: Update CHANGELOG

Document the changes in this release (create `CHANGELOG.md` if it doesn't exist).

### Step 3: Commit and Push

```bash
git add packages/*/package.json package-lock.json CHANGELOG.md
git commit -m "chore: bump version to v1.x.x"
git push origin main
```

### Step 4: Create a GitHub Release

1. Go to your GitHub repository
2. Click on "Releases" → "Create a new release"
3. Click "Choose a tag" → Type a new tag (e.g., `v1.0.0`)
4. **Release title**: `v1.0.0` (or your version)
5. **Description**: Copy from CHANGELOG or write release notes
6. Click "Publish release"

### Step 5: Automatic Publishing

Once you publish the GitHub release:
1. The `publish.yml` workflow will automatically trigger
2. It will:
   - ✅ Checkout the code
   - ✅ Install dependencies
   - ✅ Build both packages
   - ✅ Run tests
   - ✅ Publish `@owenbush/ableton-inspector-core` to NPM
   - ✅ Publish `@owenbush/ableton-inspector` to NPM
3. Check the "Actions" tab to monitor progress

## Version Management

We use semantic versioning (semver):

- **Major** (`1.0.0 → 2.0.0`): Breaking changes
- **Minor** (`1.0.0 → 1.1.0`): New features, backwards compatible
- **Patch** (`1.0.0 → 1.0.1`): Bug fixes

## Troubleshooting

### Publishing fails with "npm ERR! code E401"

- Your NPM token is invalid or expired
- Regenerate the token and update the GitHub secret

### Publishing fails with "npm ERR! code E403"

- The token doesn't have write permissions to the package
- Check the token permissions on npmjs.com

### Wrong version published

- You can unpublish within 72 hours: `npm unpublish @owenbush/package@version`
- Or publish a new patch version with the fix

### Both packages should have the same version

For consistency, keep both packages at the same version number, even if only one changed.

## Manual Publishing (Emergency)

If the GitHub Action fails, you can publish manually:

```bash
# Ensure you're logged in to NPM
npm login

# Build packages
npm run build

# Publish core first
npm publish --workspace=@owenbush/ableton-inspector-core --access public

# Then publish CLI
npm publish --workspace=@owenbush/ableton-inspector --access public
```

