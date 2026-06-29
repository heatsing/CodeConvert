import type { ToolConfig } from "@/lib/tools";

export type OnlineToolMode = "code" | "regex" | "json" | "api" | "redis" | "visual" | "database" | "ascii" | "docs";

export type OnlineTool = {
  slug: string;
  name: string;
  description: string;
  mode: OnlineToolMode;
  iconName: ToolConfig["iconName"];
  accent: string;
  placeholder: string;
  sample: string;
};

export const onlineTools: OnlineTool[] = [
  {
    slug: "php-online-tool",
    name: "PHP Online Tool",
    description: "Write and run PHP snippets in a simulated online runtime.",
    mode: "code",
    iconName: "code",
    accent: "text-purple-700 bg-purple-50",
    placeholder: "<?php\necho \"Hello PHP\";",
    sample: "<?php\necho \"Hello PHP\";"
  },
  {
    slug: "python2-online-tool",
    name: "Python2 Online Tool",
    description: "Try legacy Python 2 snippets with mock execution output.",
    mode: "code",
    iconName: "code",
    accent: "text-sky-700 bg-sky-50",
    placeholder: "print 'Hello Python 2'",
    sample: "print 'Hello Python 2'"
  },
  {
    slug: "python3-online-tool",
    name: "Python3 Online Tool",
    description: "Run Python 3 style snippets in a browser workspace.",
    mode: "code",
    iconName: "code",
    accent: "text-cyan-700 bg-cyan-50",
    placeholder: "print('Hello Python 3')",
    sample: "print('Hello Python 3')"
  },
  {
    slug: "java-online-tool",
    name: "Java Online Tool",
    description: "Compile and run Java examples with simulated output.",
    mode: "code",
    iconName: "code",
    accent: "text-orange-700 bg-orange-50",
    placeholder: "class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello Java\");\n  }\n}",
    sample: "class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello Java\");\n  }\n}"
  },
  {
    slug: "c-online-tool",
    name: "C Online Tool",
    description: "Test C programs in a compact online compiler interface.",
    mode: "code",
    iconName: "code",
    accent: "text-sky-700 bg-sky-50",
    placeholder: "#include <stdio.h>\nint main(){ printf(\"Hello C\"); return 0; }",
    sample: "#include <stdio.h>\nint main(){ printf(\"Hello C\"); return 0; }"
  },
  {
    slug: "cpp-online-tool",
    name: "C++ Online Tool",
    description: "Run C++ snippets with a mock compiler console.",
    mode: "code",
    iconName: "code",
    accent: "text-blue-700 bg-blue-50",
    placeholder: "#include <iostream>\nint main(){ std::cout << \"Hello C++\"; }",
    sample: "#include <iostream>\nint main(){ std::cout << \"Hello C++\"; }"
  },
  {
    slug: "ruby-online-tool",
    name: "Ruby Online Tool",
    description: "Experiment with Ruby snippets and inspect console output.",
    mode: "code",
    iconName: "code",
    accent: "text-red-700 bg-red-50",
    placeholder: "puts 'Hello Ruby'",
    sample: "puts 'Hello Ruby'"
  },
  {
    slug: "csharp-online-tool",
    name: "C# Online Tool",
    description: "Run C# style examples in a simulated compiler.",
    mode: "code",
    iconName: "code",
    accent: "text-cyan-900 bg-cyan-50",
    placeholder: "Console.WriteLine(\"Hello C#\");",
    sample: "Console.WriteLine(\"Hello C#\");"
  },
  {
    slug: "scala-online-tool",
    name: "Scala Online Tool",
    description: "Write Scala snippets and view mock runtime output.",
    mode: "code",
    iconName: "code",
    accent: "text-red-700 bg-red-50",
    placeholder: "object Main extends App { println(\"Hello Scala\") }",
    sample: "object Main extends App { println(\"Hello Scala\") }"
  },
  {
    slug: "erlang-online-tool",
    name: "Erlang Online Tool",
    description: "Try Erlang examples with a lightweight execution panel.",
    mode: "code",
    iconName: "code",
    accent: "text-rose-700 bg-rose-50",
    placeholder: "io:format(\"Hello Erlang~n\").",
    sample: "io:format(\"Hello Erlang~n\")."
  },
  {
    slug: "perl-online-tool",
    name: "Perl Online Tool",
    description: "Run Perl snippets in a simple online console.",
    mode: "code",
    iconName: "code",
    accent: "text-amber-700 bg-amber-50",
    placeholder: "print \"Hello Perl\\n\";",
    sample: "print \"Hello Perl\\n\";"
  },
  {
    slug: "bash-online-tool",
    name: "Bash Online Tool",
    description: "Test Bash commands in a simulated shell output.",
    mode: "code",
    iconName: "code",
    accent: "text-slate-900 bg-slate-100",
    placeholder: "echo \"Hello Bash\"\npwd",
    sample: "echo \"Hello Bash\"\npwd"
  },
  {
    slug: "rust-online-tool",
    name: "Rust Online Tool",
    description: "Prototype Rust code with mock compiler feedback.",
    mode: "code",
    iconName: "code",
    accent: "text-stone-900 bg-stone-100",
    placeholder: "fn main() {\n  println!(\"Hello Rust\");\n}",
    sample: "fn main() {\n  println!(\"Hello Rust\");\n}"
  },
  {
    slug: "swift-online-tool",
    name: "Swift Online Tool",
    description: "Run Swift style snippets in a browser workspace.",
    mode: "code",
    iconName: "code",
    accent: "text-orange-700 bg-orange-50",
    placeholder: "print(\"Hello Swift\")",
    sample: "print(\"Hello Swift\")"
  },
  {
    slug: "go-online-tool",
    name: "Go Online Tool",
    description: "Compile Go snippets with simulated console output.",
    mode: "code",
    iconName: "code",
    accent: "text-cyan-700 bg-cyan-50",
    placeholder: "package main\nimport \"fmt\"\nfunc main(){ fmt.Println(\"Hello Go\") }",
    sample: "package main\nimport \"fmt\"\nfunc main(){ fmt.Println(\"Hello Go\") }"
  },
  {
    slug: "nodejs-online-tool",
    name: "Node.js Online Tool",
    description: "Run Node.js snippets and inspect stdout.",
    mode: "code",
    iconName: "code",
    accent: "text-green-700 bg-green-50",
    placeholder: "console.log('Hello Node.js');",
    sample: "console.log('Hello Node.js');"
  },
  {
    slug: "lua-online-tool",
    name: "Lua Online Tool",
    description: "Try Lua scripts with a simple output console.",
    mode: "code",
    iconName: "code",
    accent: "text-indigo-700 bg-indigo-50",
    placeholder: "print('Hello Lua')",
    sample: "print('Hello Lua')"
  },
  {
    slug: "pascal-online-tool",
    name: "Pascal Online Tool",
    description: "Run Pascal examples in a mock compiler workspace.",
    mode: "code",
    iconName: "code",
    accent: "text-blue-800 bg-blue-50",
    placeholder: "program Hello;\nbegin\n  writeln('Hello Pascal');\nend.",
    sample: "program Hello;\nbegin\n  writeln('Hello Pascal');\nend."
  },
  {
    slug: "kotlin-online-tool",
    name: "Kotlin Online Tool",
    description: "Write Kotlin snippets and view simulated output.",
    mode: "code",
    iconName: "code",
    accent: "text-violet-700 bg-violet-50",
    placeholder: "fun main() {\n  println(\"Hello Kotlin\")\n}",
    sample: "fun main() {\n  println(\"Hello Kotlin\")\n}"
  },
  {
    slug: "typescript-online-tool",
    name: "TypeScript Online Tool",
    description: "Run TypeScript-like snippets with mock transpile output.",
    mode: "code",
    iconName: "code",
    accent: "text-blue-700 bg-blue-50",
    placeholder: "const message: string = 'Hello TypeScript';\nconsole.log(message);",
    sample: "const message: string = 'Hello TypeScript';\nconsole.log(message);"
  },
  {
    slug: "vbnet-online-tool",
    name: "VB.NET Online Tool",
    description: "Try VB.NET examples in a simulated compiler.",
    mode: "code",
    iconName: "code",
    accent: "text-green-700 bg-green-50",
    placeholder: "Module Program\n  Sub Main()\n    Console.WriteLine(\"Hello VB.NET\")\n  End Sub\nEnd Module",
    sample: "Module Program\n  Sub Main()\n    Console.WriteLine(\"Hello VB.NET\")\n  End Sub\nEnd Module"
  },
  {
    slug: "r-online-tool",
    name: "R Online Tool",
    description: "Run R snippets and inspect a mock analysis result.",
    mode: "code",
    iconName: "code",
    accent: "text-blue-700 bg-blue-50",
    placeholder: "print('Hello R')\nsummary(c(1, 2, 3))",
    sample: "print('Hello R')\nsummary(c(1, 2, 3))"
  },
  {
    slug: "assembly-online-tool",
    name: "Assembly Online Tool",
    description: "Inspect assembly snippets with simulated assembler output.",
    mode: "code",
    iconName: "code",
    accent: "text-red-700 bg-red-50",
    placeholder: "section .text\n  global _start\n_start:\n  mov eax, 1",
    sample: "section .text\n  global _start\n_start:\n  mov eax, 1"
  },
  {
    slug: "groovy-online-tool",
    name: "Groovy Online Tool",
    description: "Execute Groovy style scripts in a mock runtime.",
    mode: "code",
    iconName: "code",
    accent: "text-slate-700 bg-slate-100",
    placeholder: "println 'Hello Groovy'",
    sample: "println 'Hello Groovy'"
  },
  {
    slug: "regexr",
    name: "RegExr",
    description: "Build and test regular expressions in the browser.",
    mode: "regex",
    iconName: "bug",
    accent: "text-sky-700 bg-sky-50",
    placeholder: "Enter a regular expression pattern, for example: \\b[A-Z][a-z]+\\b",
    sample: "\\b[A-Z][a-z]+\\b"
  },
  {
    slug: "online-compiler",
    name: "Online Compiler",
    description: "Run code snippets with a mock compiler workspace.",
    mode: "code",
    iconName: "code",
    accent: "text-slate-800 bg-slate-100",
    placeholder: "Paste code to run in the simulated compiler...",
    sample: "print('Hello from CodeTools AI')"
  },
  {
    slug: "rextester",
    name: "Rextester",
    description: "Prototype PHP, Python, C, Java, and SQL snippets.",
    mode: "code",
    iconName: "code",
    accent: "text-yellow-700 bg-yellow-50",
    placeholder: "Paste a snippet to simulate execution...",
    sample: "console.log('Rextester style run');"
  },
  {
    slug: "ideone",
    name: "Ideone",
    description: "Experiment with multi-language code in a compact IDE.",
    mode: "code",
    iconName: "code",
    accent: "text-slate-700 bg-slate-100",
    placeholder: "Write code for the mock IDE...",
    sample: "function main() {\n  return 'Ideone style output';\n}"
  },
  {
    slug: "gdb-online-debugger",
    name: "GDB Online Debugger",
    description: "Step through code with a simulated debugging console.",
    mode: "code",
    iconName: "bug",
    accent: "text-slate-900 bg-slate-100",
    placeholder: "Paste code to inspect with the mock debugger...",
    sample: "int main() {\n  return 0;\n}"
  },
  {
    slug: "jsfiddle",
    name: "JSFiddle",
    description: "Test front-end code with HTML, CSS, and JavaScript panels.",
    mode: "code",
    iconName: "code",
    accent: "text-blue-700 bg-blue-50",
    placeholder: "Paste HTML, CSS, or JavaScript...",
    sample: "<button id=\"demo\">Run</button>\n<script>console.log('JSFiddle style preview')</script>"
  },
  {
    slug: "codepen",
    name: "CodePen",
    description: "Sketch front-end ideas in a live-code style workspace.",
    mode: "code",
    iconName: "code",
    accent: "text-slate-900 bg-slate-100",
    placeholder: "Create a front-end snippet...",
    sample: "<h1>Hello UI</h1>\n<style>h1{color:#2563eb}</style>"
  },
  {
    slug: "json-parser",
    name: "JSON Parser",
    description: "Parse, validate, and format JSON data.",
    mode: "json",
    iconName: "fileText",
    accent: "text-violet-700 bg-violet-50",
    placeholder: "Paste JSON to parse and format...",
    sample: "{\"name\":\"CodeTools\",\"active\":true,\"items\":[1,2,3]}"
  },
  {
    slug: "postman",
    name: "Postman",
    description: "Compose API requests and inspect mock responses.",
    mode: "api",
    iconName: "wand",
    accent: "text-orange-700 bg-orange-50",
    placeholder: "GET https://api.example.com/users",
    sample: "GET https://api.example.com/users"
  },
  {
    slug: "api-docs-mock",
    name: "API Docs & Mock Tool",
    description: "Design endpoints, mock responses, and document APIs.",
    mode: "api",
    iconName: "fileText",
    accent: "text-rose-700 bg-rose-50",
    placeholder: "POST /v1/orders\n{\n  \"total\": 49\n}",
    sample: "POST /v1/orders\n{\n  \"total\": 49\n}"
  },
  {
    slug: "redis-online-test",
    name: "Redis Online Test",
    description: "Try Redis commands in a simulated command console.",
    mode: "redis",
    iconName: "code",
    accent: "text-red-700 bg-red-50",
    placeholder: "SET greeting hello\nGET greeting",
    sample: "SET greeting hello\nGET greeting"
  },
  {
    slug: "paiza",
    name: "Paiza",
    description: "Run programming exercises in a mock online compiler.",
    mode: "code",
    iconName: "code",
    accent: "text-teal-700 bg-teal-50",
    placeholder: "Paste code to run...",
    sample: "puts 'Paiza style output'"
  },
  {
    slug: "learn-git-branching",
    name: "Learn Git Branching",
    description: "Practice Git commands with a visual branch log.",
    mode: "visual",
    iconName: "code",
    accent: "text-orange-700 bg-orange-50",
    placeholder: "git checkout -b feature\ngit commit -m init\ngit merge feature",
    sample: "git checkout -b feature\ngit commit -m init\ngit merge feature"
  },
  {
    slug: "js-bin",
    name: "JS Bin",
    description: "Write and preview front-end snippets.",
    mode: "code",
    iconName: "code",
    accent: "text-cyan-700 bg-cyan-50",
    placeholder: "Paste JS Bin style code...",
    sample: "console.log('JS Bin preview');"
  },
  {
    slug: "regex-visualizer",
    name: "Regex Visualizer",
    description: "Turn regex patterns into a readable token map.",
    mode: "regex",
    iconName: "bug",
    accent: "text-sky-700 bg-sky-50",
    placeholder: "Enter a pattern to visualize...",
    sample: "^(user|admin)-\\d{3}$"
  },
  {
    slug: "code-to-image",
    name: "Code to Image",
    description: "Create a shareable code image preview.",
    mode: "visual",
    iconName: "fileText",
    accent: "text-blue-700 bg-blue-50",
    placeholder: "Paste code to turn into a visual card...",
    sample: "const message = 'Beautiful code card';"
  },
  {
    slug: "algorithm-visual-learning",
    name: "Algorithm Visual Learning",
    description: "Visualize algorithm steps from plain input.",
    mode: "visual",
    iconName: "wand",
    accent: "text-green-700 bg-green-50",
    placeholder: "Enter numbers or steps to visualize...",
    sample: "5, 2, 9, 1, 7"
  },
  {
    slug: "asciiflow",
    name: "asciiflow",
    description: "Draft ASCII diagrams from structured text.",
    mode: "ascii",
    iconName: "fileText",
    accent: "text-orange-700 bg-orange-50",
    placeholder: "API -> Worker -> Database",
    sample: "Client -> API -> Worker -> Database"
  },
  {
    slug: "codelF",
    name: "codeIf",
    description: "Generate naming ideas for variables and functions.",
    mode: "docs",
    iconName: "wand",
    accent: "text-yellow-700 bg-yellow-50",
    placeholder: "Describe the value you need to name...",
    sample: "A list of users waiting for email verification"
  },
  {
    slug: "desmos",
    name: "Desmos",
    description: "Graph simple math expressions with a text preview.",
    mode: "visual",
    iconName: "wand",
    accent: "text-green-700 bg-green-50",
    placeholder: "y = x^2 + 2x + 1",
    sample: "y = x^2 + 2x + 1"
  },
  {
    slug: "sql-online-ide",
    name: "SQL Online IDE",
    description: "Write SQL and inspect a mock result table.",
    mode: "database",
    iconName: "code",
    accent: "text-blue-700 bg-blue-50",
    placeholder: "SELECT id, name FROM users LIMIT 5;",
    sample: "SELECT id, name FROM users LIMIT 5;"
  },
  {
    slug: "regex101",
    name: "regex101",
    description: "Test regex matches and flags in the browser.",
    mode: "regex",
    iconName: "bug",
    accent: "text-blue-700 bg-blue-50",
    placeholder: "Enter a regex pattern...",
    sample: "\\w+@\\w+\\.com"
  },
  {
    slug: "webvm",
    name: "WebVM",
    description: "Run Linux-like commands in a simulated terminal.",
    mode: "code",
    iconName: "code",
    accent: "text-rose-700 bg-rose-50",
    placeholder: "ls\npwd\necho hello",
    sample: "pwd\nls\necho hello"
  },
  {
    slug: "jsitor",
    name: "Jsitor",
    description: "Write, debug, and preview front-end code snippets.",
    mode: "code",
    iconName: "code",
    accent: "text-blue-700 bg-blue-50",
    placeholder: "Paste front-end code...",
    sample: "document.body.innerHTML = '<h1>Jsitor preview</h1>';"
  },
  {
    slug: "playcode",
    name: "Playcode",
    description: "Focus on JavaScript experiments with quick output.",
    mode: "code",
    iconName: "code",
    accent: "text-green-700 bg-green-50",
    placeholder: "console.log('Playcode run')",
    sample: "console.log('Playcode run')"
  },
  {
    slug: "jseditor",
    name: "Jseditor",
    description: "Edit JavaScript online with a simple output panel.",
    mode: "code",
    iconName: "code",
    accent: "text-yellow-700 bg-yellow-50",
    placeholder: "Write JavaScript...",
    sample: "const total = [1,2,3].reduce((a,b) => a + b, 0);"
  },
  {
    slug: "liveweave",
    name: "Liveweave",
    description: "Prototype front-end layouts and preview markup.",
    mode: "code",
    iconName: "code",
    accent: "text-slate-700 bg-slate-100",
    placeholder: "Paste HTML/CSS/JS...",
    sample: "<section class=\"hero\">Liveweave</section>"
  },
  {
    slug: "replit",
    name: "Replit",
    description: "Create small projects in a mock cloud IDE.",
    mode: "code",
    iconName: "code",
    accent: "text-orange-700 bg-orange-50",
    placeholder: "Add project code...",
    sample: "console.log('Replit style project');"
  },
  {
    slug: "codesandbox",
    name: "Codesandbox",
    description: "Sketch app components in a sandbox workspace.",
    mode: "code",
    iconName: "code",
    accent: "text-slate-900 bg-slate-100",
    placeholder: "Paste component code...",
    sample: "export default function App() {\n  return <h1>Sandbox</h1>;\n}"
  },
  {
    slug: "jdoodle",
    name: "Jdoodle",
    description: "Compile multi-language snippets with mock output.",
    mode: "code",
    iconName: "code",
    accent: "text-slate-700 bg-slate-100",
    placeholder: "Paste source code...",
    sample: "public class Main { public static void main(String[] args) { } }"
  },
  {
    slug: "stackblitz",
    name: "Stackblitz",
    description: "Prototype web projects in a cloud-style IDE.",
    mode: "code",
    iconName: "code",
    accent: "text-cyan-700 bg-cyan-50",
    placeholder: "Paste app code...",
    sample: "npm create vite@latest"
  },
  {
    slug: "apipost",
    name: "Apipost",
    description: "Design, test, and document API requests.",
    mode: "api",
    iconName: "wand",
    accent: "text-orange-700 bg-orange-50",
    placeholder: "GET /health",
    sample: "GET /health"
  },
  {
    slug: "drawdb",
    name: "drawDB",
    description: "Draft database schema diagrams from table notes.",
    mode: "database",
    iconName: "fileText",
    accent: "text-slate-700 bg-slate-100",
    placeholder: "users(id, email)\norders(id, user_id, total)",
    sample: "users(id, email)\norders(id, user_id, total)"
  },
  {
    slug: "hoppscotch",
    name: "API Tool Hoppscotch",
    description: "Compose lightweight API requests with mock output.",
    mode: "api",
    iconName: "wand",
    accent: "text-teal-700 bg-teal-50",
    placeholder: "GET https://api.example.com/status",
    sample: "GET https://api.example.com/status"
  },
  {
    slug: "deepsite",
    name: "DeepSite",
    description: "Generate a one-page website draft from a prompt.",
    mode: "docs",
    iconName: "wand",
    accent: "text-indigo-700 bg-indigo-50",
    placeholder: "A portfolio page for a front-end developer",
    sample: "A portfolio page for a front-end developer"
  },
  {
    slug: "code-wiki",
    name: "Code Wiki",
    description: "Summarize repository notes into readable docs.",
    mode: "docs",
    iconName: "fileText",
    accent: "text-blue-700 bg-blue-50",
    placeholder: "Paste repository notes or README content...",
    sample: "# Project\nA small tool library with React components."
  }
];

export const onlineToolBySlug = Object.fromEntries(onlineTools.map((tool) => [tool.slug, tool])) as Record<string, OnlineTool>;

export const languageOnlineTools = onlineTools.filter((tool) => tool.slug.endsWith("-online-tool"));

export const developerOnlineTools = onlineTools.filter((tool) => !tool.slug.endsWith("-online-tool"));
