![ApexUI Banner](./public/assets/ApexUI-Logo.png)

# 🔥 ApexUI – The Ultimate Modern UI Toolkit for React

A powerful React UI library built for speed, style, and smooth interactions. With Tailwind CSS, GSAP, and Framer Motion. ApexUI delivers next-level animations, sleek components, and a developer-first workflow
**perfect for apps, dashboards, and creative portfolios. 🎯**

---

## 🚀 Installation

```bash
npm install apex-ui-kit
```

## 🛠️ Add Components via CLI

ApexUI comes with a handy CLI to add components directly to your project.

```bash
npx apex-ui-kit add hyper-card
```

## ✨ Usage Example

```jsx
import HyperCard from "./ApexUI-Kit/HyperCard/HyperCard.jsx";
// Or if you have CLI setup, you can import directly from the installed path

const App = () => {
  return (
    <div>
      <HyperCard
        starColor="#9f7aea"
        glow={true}
        beamCount={10}
        starCount={250}
      />
    </div>
  );
};

export default App;
```

## 📦 Features

- Modern, animated, and customizable React components
- Built with Tailwind CSS, GSAP, Framer Motion, Three.js, and more
- CLI for easy component scaffolding
- Perfect for dashboards, portfolios, SaaS, and creative projects

## 📚 Documentation

- [Full Documentation](https://apex-ui.in/components/docs/getting-started/installation/react-setup)
- [Component Gallery](https://apex-ui.in/components/glass-navbar)

## 🗂️ Project structure (docs site)

```
src/
├── components/MainUI/ApexUI-Kit/   # the component library (what the CLI installs)
├── site/                           # the documentation website
│   ├── config/navigation.js        # single source of truth: sidebar, search, gallery, routes
│   ├── content/components/         # one *Doc.jsx page per component
│   ├── content/guides/             # Introduction + installation guides
│   ├── docs/                       # page templates (ComponentDoc, DocShell, controls…)
│   ├── layout/                     # header, sidebar, ⌘K search, footer
│   ├── pages/                      # home, components gallery, templates, 404
│   ├── styles/theme.css            # design tokens for dark & light themes
│   └── ui/                         # shared UI (CodeBlock, Logo)
└── router/AppRouter.jsx
```

### Adding a new component to the docs

1. Put the component in `src/components/MainUI/ApexUI-Kit/<Name>/<Name>.jsx`.
2. Create `src/site/content/components/<Name>Doc.jsx` (copy `GlareCardDoc.jsx`) and fill in
   `title`, `description`, `preview`, `code`, `cli`, `props` and `dependencies`.
3. Add an entry to `componentPages` in `src/site/config/navigation.js`
   (and a screenshot in `public/assets/componentsimage/`).

The sidebar, search, gallery and prev/next links pick it up automatically.

## 🤝 Contributing

Pull requests and suggestions are welcome!  
For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT

---

**Made with ❤️ by ApexUI**
