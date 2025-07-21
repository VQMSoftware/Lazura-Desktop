
# Lazura Desktop

**Lazura** is a lightweight custom desktop web browser built with Electron, React, and TypeScript.

This guide helps you **clone**, **customize**, and **publish** your own version of Lazura using `electron-builder` on **Windows**, **Linux**, or **macOS**.

---

## 🚀 Getting Started

### 1. Clone this Repository

```
git clone https://github.com/your-username/your-forked-repo.git
cd your-forked-repo
```

### 2. Install Dependencies

```
yarn install
```

---

## 🧠 Modify the App

- Edit source code in `/src`
- UI components are built with React + styled-components
- Main app logic is in `/src/main`
- App icon: `static/app_icon/`
- Static resources: `/static`

---

## 🏗️ Build the App

To build everything (preload, renderer, main):

```
yarn run build
```

---

## 🚢 Publish a Release

### 🔐 One-Time: Create a GitHub Token (all platforms)

1. Go to https://github.com/settings/tokens
2. Generate a **classic token** with **`repo`** scope
3. Copy the token

### ✅ Make Token Available (Permanent)

#### Windows (PowerShell or cmd)

```
setx GH_TOKEN "your_token_here"
```

Then **restart PowerShell or your terminal**.

#### Linux / macOS

Add this line to your `~/.bashrc`, `~/.zshrc`, or similar:

```bash
export GH_TOKEN="your_token_here"
```

Then run:

```bash
source ~/.bashrc  # or ~/.zshrc
```

---

## 📦 Publish a Release to GitHub

To create a new versioned release (uses your `RELEASE.md` contents):

```
yarn run publish
```

It will:

- Build and sign your app
- Create a **draft GitHub release**
- Upload the `.exe`/`.dmg`/`.AppImage` files

---

## 🧾 Customize Publishing

Publishing settings are in:

- `electron-builder.json` → App + packaging settings
- `artifacts.yml` → GitHub repo + release info

You can edit them to use your own repo, product name, icons, and more.

---

## 🧪 Notes

- You must update your `package.json` version for each release (`1.0.0`, `1.0.1`, etc)
- You can make the GitHub draft release public manually
- Works across Windows, macOS, and Linux

---
