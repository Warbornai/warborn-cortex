# ⚡ Warborn Cortex

> **Central intelligence, context routing, and agent orchestration engine for the Warborn AI Operating System.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![CI Status](https://img.shields.io/github/actions/workflow/status/Warbornai/warborn-cortex/build.yml?branch=main&style=for-the-badge)](https://github.com/Warbornai/warborn-cortex/actions)

---

## 🎯 Features

* **Agent**: Agent state management and lifecycle orchestration
* **Dynamic**: Dynamic prompt & tool routing pipeline
* **High-throughput**: High-throughput asynchronous event bus
* **Built-in**: Built-in state persistence and checkpointing

---

## 🏗️ Architecture

```text
Cortex Engine -> Context Router -> Agent Dispatcher -> Execution Pipeline
```

---

## 📋 Requirements

* **Node.js**: >= 18.0.0
* **Package Manager**: npm >= 9.0.0 or pnpm >= 8.0.0

---

## 🚀 Installation

```bash
npm install @warborn/cortex
```

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev --if-present

# Run linter
npm run lint

# Run type checker
npm run type-check
```

---

## 📦 Build

```bash
npm run build
```

---

## 🧪 Testing

```bash
npm test
```

---

## 🚢 Deployment

Deployments are automated via GitHub Actions on version tags (`v*.*.*`).

---

## 🔑 Environment Variables

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Application environment (`development` / `production`) | `development` | Yes |
| `LOG_LEVEL` | Logging level (`info` / `debug` / `error`) | `info` | No |

---

## 📁 Repository Structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
├── dist/
├── src/
├── .editorconfig
├── .eslintrc
├── .gitignore
├── .prettierrc
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
└── package.json
```

---

## 🤝 Contributing

Please see our [CONTRIBUTING.md](CONTRIBUTING.md) guide and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

## 🗺️ Roadmap

* [ ] **v1.1.0**: Core API stabilization & performance benchmarks.
* [ ] **v1.2.0**: Extended telemetry & observability integrations.

---

## 💬 Support

For security reports, review [SECURITY.md](SECURITY.md). For feature requests and bug reports, please open an issue using our [GitHub Templates](.github/ISSUE_TEMPLATE/).
