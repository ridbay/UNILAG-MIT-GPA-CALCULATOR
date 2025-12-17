# UNILAG MIT GPA Calculator

A modern, responsive GPA calculator specifically designed for students of the **Master of Information Technology (MIT)** program at the **University of Lagos (UNILAG)**, Nigeria.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-cyan?logo=tailwindcss)

## 🎯 Features

- **Accurate GPA Calculation**: Uses the official UNILAG 5-point grading scale (A=5, B=4, C=3, D=2, E=1, F=0)
- **MIT Programme Courses**: Includes all 21 MIT courses (13 compulsory + 8 electives) with pre-configured credit units
- **User Session Management**: Users can enter their matriculation number to save and retrieve their course data
- **Local Storage Persistence**: Results are saved locally and persist across browser sessions
- **Graduation Status Tracking**: Real-time feedback on academic standing and graduation eligibility
- **Progress Requirements**: Tracks compulsory courses passed, minimum units, and outstanding units
- **GPA Goal Simulator**: Calculate the grades needed to achieve your target CGPA
- **Share & Export**: Share your results as an image or download as a comprehensive PDF report
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Switch User Support**: Multiple users can use the app on the same device

## 📊 Grading System

The calculator implements the UNILAG postgraduate grading scale:

| Grade | Grade Point | Description |
|-------|-------------|-------------|
| A     | 5.0         | Excellent   |
| B     | 4.0         | Very Good   |
| C     | 3.0         | Good        |
| D     | 2.0         | Fair        |
| E     | 1.0         | Pass        |
| F     | 0.0         | Fail        |

## 🎓 Graduation Requirements

The application tracks the following MIT programme requirements:

- **Minimum Units Required**: 54 units
- **Compulsory Courses**: 13 courses must be passed
- **Total Credit Units**: 62 units (full programme)

### Academic Standing Thresholds

| CGPA Range | Status |
|------------|--------|
| ≥ 4.50     | Graduate with Distinction |
| ≥ 2.40     | Graduate with Pass |
| 1.50 - 2.39| Fail/Repeat |
| < 1.50     | Fail/Withdraw |

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/UNILAG-MIT-GPA-CALCULATOR.git
   cd UNILAG-MIT-GPA-CALCULATOR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Build for Production

```bash
npm run build
```

The production build will be generated in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
UNILAG-MIT-GPA-CALCULATOR/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # Vite type declarations
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.ts       # Vite configuration
└── eslint.config.js     # ESLint configuration
```

## 🔧 Technologies Used

- **[React](https://react.dev/)** - UI library for building component-based interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon toolkit

## 📚 MIT Programme Courses

### Compulsory Courses (13)

| Code | Course Name | Units |
|------|-------------|-------|
| MIT 801 | Introduction to Information Technology | 3 |
| MIT 802 | Introduction to Database Management | 3 |
| MIT 803 | Programming Languages | 3 |
| MIT 804 | Object-Oriented Programming | 3 |
| MIT 805 | Computer Systems and Organization | 3 |
| MIT 806 | IT and LAW | 3 |
| MIT 808 | Concepts and Application of E-Business | 2 |
| MIT 811 | Analysis and Design of Business Information Systems | 3 |
| MIT 812 | Computer Networks and Communication Protocol | 3 |
| MIT 815 | Internet Programming and Applications | 3 |
| MIT 821 | Software Systems | 3 |
| MIT 824 | Seminar on Current Topics in Information Technology | 3 |
| MIT 899 | Project | 6 |

### Elective Courses (8)

| Code | Course Name | Units |
|------|-------------|-------|
| MIT 807 | AI and its Business Application | 3 |
| MIT 809 | Elements of Scientific Computing | 3 |
| MIT 813 | Advanced Database Management Systems | 3 |
| MIT 814 | Human Computer Interactions | 3 |
| MIT 816 | Data Warehousing, Data Mining and Business Intelligence | 3 |
| MIT 817 | Software Engineering | 3 |
| MIT 822 | Operating Systems | 3 |
| MIT 823 | Office Automation and Project Management | 3 |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-username/UNILAG-MIT-GPA-CALCULATOR/issues)
2. If not, create a new issue with:
   - A clear title and description
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

Open an issue with the **enhancement** label describing:
- The feature you'd like to see
- Why it would be useful
- Any implementation ideas

### Pull Requests

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make** your changes
4. **Test** your changes locally
5. **Commit** with clear, descriptive messages
   ```bash
   git commit -m "feat: add new feature description"
   ```
6. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open** a Pull Request

### Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing code structure and naming conventions
- Use Tailwind CSS utility classes for styling
- Keep components modular and reusable
- Write clear comments for complex logic

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint to check code quality |

## 🐛 Known Issues

- None currently reported

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Ridwan Balogun**

- Website: [balogunridwan.com](https://balogunridwan.com)
- GitHub: [@ridbay](https://github.com/ridbay)

---

## 💡 Future Enhancements

- [ ] CGPA calculation across multiple semesters
- [ ] Dark mode support
- [ ] Cloud sync with user authentication
- [ ] Performance analytics and charts

---

<p align="center">
  Made with ❤️ for UNILAG MIT Students
</p>
