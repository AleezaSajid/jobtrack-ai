const invalidResumePattern = /(thesis|report|assignment|documentation|project documentation)/i
const validResumePattern = /(resume|cv|frontend|backend|internship|software engineering)/i

const statusPriority = {
  Interview: 1,
  Offer: 2,
  Applied: 3,
  Wishlist: 4,
  Rejected: 5,
}

const topicAliases = [
  {topic: 'C#', intent: 'exactTopic', pattern: /(^|[\s"'`(])c#(?=$|[\s"'`),?.!])/i},
  {topic: 'Java', intent: 'exactTopic', pattern: /\bjava\b(?!script)/i},
  {topic: 'Python', intent: 'exactTopic', pattern: /\bpython\b/i},
  {topic: 'React', intent: 'react', pattern: /\b(react|jsx)\b/i},
  {topic: 'JavaScript', intent: 'javascript', pattern: /\b(javascript|js|dom|async|await|promise)\b/i},
  {topic: 'HTML', intent: 'html', pattern: /\b(html|semantic|tags?|forms?|input|label|accessibility)\b/i},
  {topic: 'CSS', intent: 'css', pattern: /\b(css|flexbox|grid|responsive|media query|layout|position|spacing|animation)\b/i},
  {topic: 'APIs', intent: 'api', pattern: /\b(api|apis|fetch|request|response|endpoint|json|http|rest)\b/i},
  {topic: 'Frontend Development', intent: 'frontend', pattern: /\b(frontend|front-end|ui|browser|client side|client-side)\b/i},
  {topic: 'Backend Development', intent: 'backend', pattern: /\b(backend|back-end|server|database|node|express|sql|mongodb|auth)\b/i},
  {topic: 'Git/GitHub', intent: 'learning', pattern: /\b(git|github|commit|branch|pull request|merge|repo|repository)\b/i},
  {topic: 'Resume Writing', intent: 'resume', pattern: /\b(resume|cv|ats|summary|skills|projects|keywords|bullet)\b/i},
  {topic: 'LinkedIn', intent: 'linkedin', pattern: /\b(linkedin|profile|headline|about section|networking)\b/i},
  {topic: 'Interview Preparation', intent: 'interview', pattern: /\b(interview|prepare|practice|questions|mock interview)\b/i},
]

const exactTopicDefinitions = {
  'C#': {
    topic: 'C#',
    definition: 'C# is a modern object-oriented programming language created by Microsoft, commonly used for desktop apps, web APIs, games, and enterprise software.',
    example: 'string name = "Aleeza";\nConsole.WriteLine("Hello, " + name);',
    interview: 'Interview line: C# is strongly typed, object-oriented, and often used with .NET for building scalable applications.',
  },
  Java: {
    topic: 'Java',
    definition: 'Java is a class-based, object-oriented programming language used for backend systems, Android apps, enterprise software, and large-scale applications.',
    example: 'String name = "Aleeza";\nSystem.out.println("Hello, " + name);',
    interview: 'Interview line: Java is platform-independent through the JVM and is widely used for reliable backend and enterprise systems.',
  },
  Python: {
    topic: 'Python',
    definition: 'Python is a beginner-friendly programming language known for readable syntax and use in web development, automation, data science, AI, and scripting.',
    example: 'name = "Aleeza"\nprint("Hello, " + name)',
    interview: 'Interview line: Python is dynamically typed, readable, and popular for fast development across many domains.',
  },
  function: {
    topic: 'function',
    definition: 'A function is a reusable block of code that performs a specific task.',
    example: 'function greet(name) {\n  return "Hello, " + name;\n}\n\ngreet("Aleeza");',
    interview: 'Interview line: A function helps avoid repeating code by wrapping logic you can call again.',
  },
  variable: {
    topic: 'variable',
    definition: 'A variable is a named place to store a value so you can use it later.',
    example: 'const company = "NovaTech";\nlet status = "Interview";',
    interview: 'Interview line: Variables store data, while const and let control whether the binding can be reassigned.',
  },
  array: {
    topic: 'array',
    definition: 'An array is an ordered list of values.',
    example: 'const applications = ["NovaTech", "OpenWave Labs", "PixelDrive"];\nconsole.log(applications[0]);',
    interview: 'Interview line: Arrays are useful when you need to store and loop through multiple related values.',
  },
  object: {
    topic: 'object',
    definition: 'An object stores related data as key-value pairs.',
    example: 'const application = {\n  company: "NovaTech",\n  role: "Junior Frontend"\n};',
    interview: 'Interview line: Objects model real things by grouping related properties together.',
  },
  event: {
    topic: 'event',
    definition: 'An event is something that happens in the browser, like a click, typing, or submitting a form.',
    example: 'button.addEventListener("click", () => {\n  console.log("Clicked");\n});',
    interview: 'Interview line: Events let JavaScript respond to user actions and update the UI.',
  },
  parameter: {
    topic: 'parameter',
    definition: 'A parameter is a named input listed in a function definition.',
    example: 'function greet(name) {\n  return "Hello, " + name;\n}',
    interview: 'Interview line: Parameters define what information a function expects to receive.',
  },
  argument: {
    topic: 'argument',
    definition: 'An argument is the actual value passed into a function when you call it.',
    example: 'function greet(name) {\n  return "Hello, " + name;\n}\n\ngreet("Aleeza");',
    interview: 'Interview line: A parameter is the placeholder; an argument is the real value passed in.',
  },
  return: {
    topic: 'return',
    definition: 'Return sends a value back from a function.',
    example: 'function add(a, b) {\n  return a + b;\n}\n\nconst total = add(2, 3);',
    interview: 'Interview line: Return is how a function produces an output for other code to use.',
  },
  React: {
    topic: 'React',
    definition: 'React is a JavaScript library used to build user interfaces with reusable components.',
    example: 'function JobCard({ role }) {\n  return <h3>{role}</h3>;\n}',
    interview: 'Interview line: React helps build component-based UIs and efficiently updates the screen when data changes.',
  },
  state: {
    topic: 'state',
    definition: 'State is data a React component remembers and can change over time.',
    example: 'const [count, setCount] = useState(0);\nsetCount(count + 1);',
    interview: 'Interview line: State is for values that change and should cause the UI to re-render.',
  },
  props: {
    topic: 'props',
    definition: 'Props are values passed from a parent component into a child component.',
    example: 'function JobCard({ company }) {\n  return <p>{company}</p>;\n}',
    interview: 'Interview line: Props are read-only inputs; state is managed inside the component.',
  },
  component: {
    topic: 'component',
    definition: 'A component is a reusable piece of UI in React.',
    example: 'function Button() {\n  return <button>Save</button>;\n}',
    interview: 'Interview line: Components make UI easier to reuse, organize, and maintain.',
  },
  hook: {
    topic: 'hook',
    definition: 'A hook is a React function that lets components use features like state and effects.',
    example: 'const [name, setName] = useState("");\nuseEffect(() => {\n  console.log(name);\n}, [name]);',
    interview: 'Interview line: Hooks let function components manage state, side effects, and reusable logic.',
  },
  API: {
    topic: 'API',
    definition: 'An API is a way for one program to request data or actions from another program.',
    example: 'const response = await fetch("/applications");\nconst data = await response.json();',
    interview: 'Interview line: APIs connect the frontend to data or services, usually through requests and responses.',
  },
}

const exactTopicPatterns = [
  {key: 'C#', pattern: /(^|[\s"'`(])c#(?=$|[\s"'`),?.!])/i},
  {key: 'Java', pattern: /\bjava\b(?!script)/i},
  {key: 'Python', pattern: /\bpython\b/i},
  {key: 'function', pattern: /\bfunctions?\b/i},
  {key: 'variable', pattern: /\bvariables?\b/i},
  {key: 'array', pattern: /\barrays?\b/i},
  {key: 'object', pattern: /\bobjects?\b/i},
  {key: 'event', pattern: /\bevents?\b/i},
  {key: 'parameter', pattern: /\bparameters?\b/i},
  {key: 'argument', pattern: /\barguments?\b/i},
  {key: 'return', pattern: /\breturn\b/i},
  {key: 'React', pattern: /\breact\b/i},
  {key: 'state', pattern: /\bstate\b/i},
  {key: 'props', pattern: /\bprops?\b/i},
  {key: 'component', pattern: /\bcomponents?\b/i},
  {key: 'hook', pattern: /\bhooks?\b/i},
  {key: 'API', pattern: /\bapis?\b/i},
]

const phraseIntents = [
  {intent: 'declarationVsInitialization', phrase: 'declaration and initialization'},
  {intent: 'declarationVsInitialization', phrase: 'declaration vs initialization'},
  {intent: 'declarationVsInitialization', phrase: 'declaration versus initialization'},
  {intent: 'variableInitialization', phrase: 'initialization of a variable'},
  {intent: 'variableInitialization', phrase: 'variable initialization'},
  {intent: 'variableDeclaration', phrase: 'declaration of a variable'},
  {intent: 'functionDeclaration', phrase: 'function declaration'},
  {intent: 'callbackFunction', phrase: 'callback function'},
  {intent: 'functionExpression', phrase: 'function expression'},
  {intent: 'variableDeclaration', phrase: 'variable declaration'},
  {intent: 'arrowFunction', phrase: 'arrow function'},
  {intent: 'asyncAwait', phrase: 'async await'},
  {intent: 'localScope', phrase: 'local scope'},
  {intent: 'globalScope', phrase: 'global scope'},
  {intent: 'eventLoop', phrase: 'event loop'},
  {intent: 'hoisting', phrase: 'hoisting'},
  {intent: 'closure', phrase: 'closure'},
  {intent: 'promise', phrase: 'promise'},
  {intent: 'scope', phrase: 'scope'},
].sort((a, b) => b.phrase.length - a.phrase.length)

const topicLessons = {
  React: {
    direct: 'React is a JavaScript library used to build user interfaces. It helps create reusable components and update the screen efficiently when data changes.',
    simple: 'React lets you split a screen into small reusable pieces called components. When the data changes, React updates the right part of the screen.',
    example: 'Example: a JobCard component can receive company, role, and status as props, then use state to show or hide details when the user clicks it.',
    next: 'Explain one component from JobTrack AI, what props it receives, and what state changes inside it.',
    questions: [
      'What is a React component?',
      'What is the difference between props and state?',
      'When would you use useEffect?',
      'How do you fetch API data and show loading/error states?',
      'How would you debug a component that is not updating?',
    ],
  },
  JavaScript: {
    direct: 'JavaScript is the programming language that makes web pages interactive.',
    simple: 'JavaScript lets a page respond to clicks, store values, update content, and fetch data from APIs.',
    example: 'Example: when a user clicks Save Application, JavaScript reads the form values, validates them, and stores the new application.',
    next: 'Review variables, functions, arrays, objects, DOM events, and async/await with one tiny example each.',
    questions: [
      'What is the difference between let, const, and var?',
      'How do arrays and objects differ?',
      'What is an event listener?',
      'What does async/await do?',
      'How do you handle errors from a fetch request?',
    ],
  },
  HTML: {
    direct: 'HTML defines the structure and meaning of content on a web page.',
    simple: 'HTML is the skeleton of the page: headings, paragraphs, forms, buttons, inputs, and labels.',
    example: 'Example: a form uses label, input, select, textarea, and button elements so users can enter an application cleanly.',
    next: 'Practice explaining semantic tags and why labels improve accessibility.',
    questions: [
      'Why are semantic HTML tags useful?',
      'What does a label do for an input?',
      'How do forms submit data?',
      'What makes a button accessible?',
      'When should you use section or article?',
    ],
  },
  CSS: {
    direct: 'CSS controls layout, spacing, colors, typography, and responsive behavior.',
    simple: 'CSS is how the page gets its visual design and adapts to different screen sizes.',
    example: 'Example: CSS Grid can show application cards in two columns on desktop and one column on mobile.',
    next: 'Revise flexbox, grid, media queries, hover states, and spacing systems.',
    questions: [
      'When would you use flexbox instead of grid?',
      'How do media queries work?',
      'What is the box model?',
      'How do you avoid overflow on mobile?',
      'How would you create a hover lift effect?',
    ],
  },
  APIs: {
    direct: 'An API is a way for one piece of software to request data or actions from another system.',
    simple: 'APIs let the frontend ask the backend for information, like applications or resumes.',
    example: 'Example: fetch("/applications") could request job applications, then React renders them as cards.',
    next: 'Practice explaining request, response, endpoint, JSON, status code, loading state, and error state.',
    questions: [
      'What is an API endpoint?',
      'What is JSON?',
      'How do you show loading and error states?',
      'What is the difference between GET and POST?',
      'How would you debug a failed API request?',
    ],
  },
  'Frontend Development': {
    direct: 'Frontend development is building the part of software users see and interact with.',
    simple: 'Frontend combines HTML, CSS, JavaScript, React, API calls, accessibility, and responsive design.',
    example: 'Example: JobTrack AI uses frontend logic to show pipeline cards, forms, chat messages, and resume previews.',
    next: 'Prepare a project story that explains UI, state, data flow, and mobile responsiveness.',
    questions: [
      'How do HTML, CSS, JavaScript, and React work together?',
      'How do you make a page responsive?',
      'How do you handle form validation?',
      'How do you call an API from a frontend app?',
      'How do you improve accessibility?',
    ],
  },
  'Backend Development': {
    direct: 'Backend development is building the server-side logic, data storage, APIs, and authentication behind an app.',
    simple: 'Backend code stores data, checks permissions, runs business logic, and sends responses to the frontend.',
    example: 'Example: a backend could save applications in a database and return them through an API endpoint.',
    next: 'Revise APIs, databases, authentication, validation, and error handling.',
    questions: [
      'What does a backend server do?',
      'What is a REST API?',
      'How do databases store application records?',
      'Why is validation needed on the server?',
      'How would you protect private user data?',
    ],
  },
  'Git/GitHub': {
    direct: 'Git tracks code changes, and GitHub hosts repositories so teams can collaborate.',
    simple: 'Git is your project history. GitHub is where that history can be shared, reviewed, and backed up.',
    example: 'Example: create a branch for AI changes, commit the work, then open a pull request for review.',
    next: 'Practice commit, branch, merge, pull request, and resolving conflicts.',
    questions: [
      'What is a Git commit?',
      'Why do developers use branches?',
      'What is a pull request?',
      'How do you resolve a merge conflict?',
      'What should a good commit message include?',
    ],
  },
  'Resume Writing': {
    direct: 'Resume writing is about matching your strongest experience to the role clearly and quickly.',
    simple: 'A good resume helps recruiters see your role fit, skills, projects, and impact in seconds.',
    example: 'Example bullet: Built a responsive job tracker with React and localStorage to manage applications, resumes, and AI coaching workflows.',
    next: 'Rewrite one project bullet as: Built [feature] using [tech] to achieve [result].',
    questions: [
      'Does your summary match your target role?',
      'Are your strongest projects near the top?',
      'Do bullets show action and outcome?',
      'Are keywords included naturally?',
      'Is the file clearly named as a resume or CV?',
    ],
  },
  LinkedIn: {
    direct: 'LinkedIn should show your target role, strongest skills, projects, and job-search credibility.',
    simple: 'Think of LinkedIn as your public resume plus networking profile.',
    example: 'Example headline: Software Engineering Student | Frontend React Projects | Seeking Internship Roles.',
    next: 'Update your headline, About section, featured projects, and skills list.',
    questions: [
      'Does your headline say your target role?',
      'Does your About section mention projects and skills?',
      'Are your best projects featured?',
      'Do your skills match job postings?',
      'Have you connected with recruiters or alumni?',
    ],
  },
  'Interview Preparation': {
    direct: 'Interview preparation means practicing technical fundamentals, project explanations, and behavioral stories before the conversation.',
    simple: 'Prepare what you know, what you built, and how you solve problems.',
    example: 'Example: for a Junior Frontend role, revise React components, props/state, hooks, API calls, debugging, and your strongest UI project.',
    next: 'Practice one technical answer and one STAR story out loud today.',
    questions: [
      'Tell me about yourself.',
      'Walk me through your strongest project.',
      'How do props and state differ in React?',
      'Describe a difficult bug and how you fixed it.',
      'Why are you interested in this role?',
    ],
  },
}

export const createEmptyAiMemory = () => ({
  lastIntent: '',
  lastTopic: '',
  lastApplication: null,
  lastResume: null,
  currentGoal: '',
  learningMode: false,
  learningTopic: '',
  interviewTarget: null,
  conversationHistory: [],
})

export const isValidResume = (resume) => {
  const searchable = `${resume?.name || ''} ${resume?.target || ''} ${resume?.notes || ''}`
  return Boolean(resume) && !invalidResumePattern.test(searchable) && validResumePattern.test(searchable)
}

export const pickRecommendedResume = (resumes = []) => {
  const valid = resumes.filter(isValidResume)
  return valid.find((resume) => /(resume|cv)/i.test(resume.name) && /software engineering/i.test(resume.name)) ||
    valid.find((resume) => /(resume|cv)/i.test(resume.name) && /frontend/i.test(`${resume.name} ${resume.target}`)) ||
    valid.find((resume) => /(resume|cv)/i.test(resume.name) && /backend/i.test(`${resume.name} ${resume.target}`)) ||
    valid.find((resume) => /(resume|cv)/i.test(resume.name) && /internship/i.test(`${resume.name} ${resume.target}`)) ||
    valid.find((resume) => /(resume|cv)/i.test(resume.name)) ||
    valid[0] ||
    null
}

const compact = (value) => String(value || '').trim()

const formatApplication = (app) => app ? `${app.company} (${app.role})` : 'your next tracked opportunity'

const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : 'date not set'

const sortByPriority = (applications = []) =>
  [...applications].sort((a, b) => (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99))

const pickPriorityApplication = (applications = []) => sortByPriority(applications)[0] || null

const pickLatestApplication = (applications = []) => applications[0] || null

const findTopic = (message) => topicAliases.find((item) => item.pattern.test(message)) || null

const findExactTopic = (message) => {
  const match = exactTopicPatterns.find((item) => item.pattern.test(message))
  return match ? exactTopicDefinitions[match.key] : null
}

const findPhraseIntent = (message) => {
  const normalized = message.toLowerCase().replace(/[^\w\s]/g, ' ')
  return phraseIntents.find((item) => new RegExp(`\\b${item.phrase.replace(/\s+/g, '\\s+')}\\b`, 'i').test(normalized)) || null
}

const findExactDefinitionByTopic = (topic) =>
  Object.values(exactTopicDefinitions).find((item) => item.topic.toLowerCase() === String(topic || '').toLowerCase()) || null

const resolveLearningTopic = (message, memory) => {
  const explicitExact = findExactTopic(message)
  if(explicitExact) return explicitExact.topic

  const explicit = findTopic(message)
  if(explicit) return explicit.topic

  const lower = message.toLowerCase()
  if(/\b(state|props|hook|component|jsx)\b/.test(lower) && /react/i.test(memory.learningTopic || memory.lastTopic || '')){
    return 'React'
  }
  if(/\b(variable|function|array|object|dom|async|await|promise)\b/.test(lower) && /javascript/i.test(memory.learningTopic || memory.lastTopic || '')){
    return 'JavaScript'
  }
  if(/\b(endpoint|request|response|fetch|json)\b/.test(lower)){
    return 'APIs'
  }
  return memory.learningTopic || memory.lastTopic || 'Frontend Development'
}

const detectIntent = (message, memory) => {
  const lower = message.toLowerCase().trim()
  const phraseIntent = findPhraseIntent(message)
  const exactTopic = findExactTopic(message)
  const topicMatch = findTopic(message)
  const wasLearningReact = /react/i.test(`${memory.learningTopic || ''} ${memory.lastTopic || ''}`)
  const followUpQuestionTopic = memory.learningTopic && !/\b(upcoming|my interview|application|role|company|novatech)\b/.test(lower)

  if(phraseIntent) return {intent: phraseIntent.intent, topic: phraseIntent.phrase}
  if(exactTopic) return {intent: 'exactTopic', topic: exactTopic.topic}
  if(topicMatch?.intent === 'exactTopic') return {intent: 'exactTopic', topic: topicMatch.topic}
  if(/^(hi|hello|hey|hi there|hello there)\b/.test(lower)) return {intent: 'greeting', topic: 'career help'}
  if(wasLearningReact && /\b(state)\b/.test(lower)) return {intent: 'explainTopic', topic: 'React state'}
  if(wasLearningReact && /\b(props?|properties)\b/.test(lower)) return {intent: 'explainTopic', topic: 'React props'}
  if(/\b(explain it simply|explain simply|simple|simpler|what does that mean)\b/.test(lower)) return {intent: 'explainTopic', topic: resolveLearningTopic(message, memory), mode: 'simple'}
  if(/\b(give example|example|show example)\b/.test(lower)) return {intent: 'explainTopic', topic: resolveLearningTopic(message, memory), mode: 'example'}
  if(/\b(give me questions|more questions|practice questions|interview questions)\b/.test(lower)) return {intent: 'technical', topic: followUpQuestionTopic ? memory.learningTopic : resolveLearningTopic(message, memory)}
  if(/\b(cover letter)\b/.test(lower)) return {intent: 'coverLetter', topic: 'cover letter'}
  if(/\b(follow up|follow-up|recruiter|email|reply|message)\b/.test(lower)) return {intent: 'followUp', topic: 'recruiter follow-up'}
  if(/\b(weekly|plan|schedule|routine)\b/.test(lower)) return {intent: 'weeklyPlan', topic: 'weekly job search plan'}
  if(/\b(prioritize|priority|next|focus|application)\b/.test(lower)) return {intent: 'priority', topic: 'application priority'}
  if(/\b(behavioral|star|tell me about a time|strength|weakness)\b/.test(lower)) return {intent: 'behavioral', topic: 'behavioral interview'}
  if(/\b(technical|coding|debug|debugging)\b/.test(lower)) return {intent: 'technical', topic: resolveLearningTopic(message, memory)}
  if(topicMatch) return {intent: topicMatch.intent, topic: topicMatch.topic}
  if(/\b(interview|prepare|practice|mock)\b/.test(lower)) return {intent: 'interview', topic: 'Interview Preparation'}
  if(/\b(teach|learn|study)\b/.test(lower) && (topicMatch || memory.learningTopic)) return {intent: 'learning', topic: resolveLearningTopic(message, memory)}
  if(/\b(explain|what is|what are|how does|how do)\b/.test(lower)) return {intent: 'generalFallback', topic: lower}
  if(/\b(career|job search|internship|recruiter|hiring|portfolio|linkedin|resume|cv)\b/.test(lower)) return {intent: 'careerAdvice', topic: 'career advice'}

  return {intent: 'generalFallback', topic: lower}
}

const buildHistory = (memory, message, detected) => [
  ...(memory.conversationHistory || []),
  {
    role: 'user',
    message: message.slice(0, 160),
    intent: detected.intent,
    topic: detected.topic,
  },
].slice(-8)

const updateMemory = (memory, detected, contextUpdates = {}, message = '') => ({
  ...memory,
  lastIntent: detected.intent,
  lastTopic: detected.topic,
  learningMode: ['learning', 'react', 'javascript', 'frontend', 'backend', 'html', 'css', 'api', 'technical', 'explainTopic', 'exactTopic'].includes(detected.intent),
  learningTopic: ['learning', 'react', 'javascript', 'frontend', 'backend', 'html', 'css', 'api', 'technical', 'explainTopic', 'exactTopic'].includes(detected.intent)
    ? detected.topic
    : memory.learningTopic,
  conversationHistory: buildHistory(memory, message, detected),
  ...contextUpdates,
})

const lessonResponse = (topic, mode = 'direct') => {
  if(topic === 'React state'){
    if(mode === 'example'){
      return 'Example:\nImagine a ResumeDetails panel with a selectedResume value. When the user clicks a resume, selectedResume changes, and React re-renders the details panel with the new resume information.\n\nWhy it matters:\nState is useful for values that change because of user interaction.\n\nPractical next step:\nName one changing value in your app and explain why it should be state.'
    }
    return mode === 'simple'
      ? 'React state is data a component remembers and can change.\n\nSimple example:\nIf a button counts clicks, the count is state because it changes when the user clicks.\n\nPractical next step:\nPractice explaining one state value from a project, what changes it, and what the user sees.'
      : 'React state is data owned by a component that can change over time. When state changes, React re-renders the component so the screen reflects the new data.\n\nExample:\nA selected application, open drawer, search query, or form input value can be state.\n\nPractical next step:\nExplain how useState stores a value and how its setter updates the UI.'
  }
  if(topic === 'React props'){
    if(mode === 'example'){
      return 'Example:\nAn ApplicationCard component can receive company, role, location, and status as props. The parent decides the data, and the card displays it.\n\nWhy it matters:\nProps make components reusable across many applications.\n\nPractical next step:\nExplain how the same card component can show OpenWave Labs and NovaTech with different props.'
    }
    return mode === 'simple'
      ? 'Props are data passed into a React component from its parent.\n\nSimple example:\nA JobCard receives company, role, and status as props so it can display the right application.\n\nPractical next step:\nExplain how props are different from state.'
      : 'Props are read-only inputs passed from a parent component to a child component. They let one reusable component display different data.\n\nExample:\nApplicationCard can receive company, role, status, and location as props.\n\nPractical next step:\nPractice this answer: props come from outside the component, state is managed inside the component.'
  }
  const lesson = topicLessons[topic] || topicLessons['Frontend Development']
  if(mode === 'simple'){
    return `${lesson.simple}\n\nWhy it matters:\nInterviewers want to know that you understand the idea clearly, not just the definition.\n\nPractical next step:\n${lesson.next}`
  }
  if(mode === 'example'){
    return `${lesson.example}\n\nHow to use it in an interview:\nConnect the example to a real project you built.\n\nPractical next step:\n${lesson.next}`
  }
  return `${lesson.direct}\n\nShort explanation:\n${lesson.simple}\n\nPractical next step:\n${lesson.next}`
}

const exactTopicResponse = (topic, mode = 'direct') => {
  const entry = findExactDefinitionByTopic(topic)
  if(!entry) return lessonResponse(topic)

  if(mode === 'example'){
    return `Example of ${entry.topic}:\n${entry.example}\n\nSimple idea:\n${entry.definition}\n\n${entry.interview}`
  }
  if(mode === 'simple'){
    return `${entry.definition}\n\nTiny example:\n${entry.example}\n\nInterview-style line:\n${entry.interview.replace('Interview line: ', '')}`
  }
  return `${entry.definition}\n\nTiny code example:\n${entry.example}\n\n${entry.interview}`
}

const phraseIntentResponse = (intent) => {
  const responses = {
    functionExpression: 'A function expression creates a function and stores it in a variable.\n\nExample:\nconst greet = function(name) {\n  return "Hello, " + name;\n};\n\nInterview line:\nA function expression is not fully hoisted like a function declaration, so you usually call it after it is assigned.',
    functionDeclaration: 'A function declaration defines a named function using the function keyword.\n\nExample:\nfunction greet(name) {\n  return "Hello, " + name;\n}\n\nInterview line:\nFunction declarations are hoisted, so they can be called before the line where they are written.',
    variableDeclaration: 'A variable declaration creates a variable name in memory.\n\nExample:\nlet score;\nconst company = "NovaTech";\n\nInterview line:\nDeclaration means introducing the variable name; it does not always mean giving it a value.',
    variableInitialization: 'Variable initialization means giving a variable its first value.\n\nExample:\nlet score;\nscore = 10;\n\n// declaration + initialization together\nconst company = "NovaTech";\n\nInterview line:\nDeclaration creates the variable; initialization assigns its first value.',
    declarationVsInitialization: 'Declaration and initialization are related, but they are not the same.\n\nExample:\nlet score;      // declaration\nscore = 10;     // initialization\n\nconst company = "NovaTech"; // declaration and initialization together\n\nInterview line:\nDeclaration introduces the variable name; initialization gives it its first value.',
    arrowFunction: 'An arrow function is a shorter function syntax often used for callbacks and React handlers.\n\nExample:\nconst add = (a, b) => a + b;\n\nInterview line:\nArrow functions are concise and do not bind their own this value.',
    hoisting: 'Hoisting is JavaScript behavior where declarations are processed before code runs.\n\nExample:\nsayHi();\nfunction sayHi() {\n  return "Hi";\n}\n\nInterview line:\nFunction declarations are hoisted differently from let, const, and function expressions.',
    closure: 'A closure happens when a function remembers variables from the scope where it was created.\n\nExample:\nfunction makeCounter() {\n  let count = 0;\n  return function() {\n    count += 1;\n    return count;\n  };\n}\n\nInterview line:\nClosures let functions keep access to private data after the outer function has finished.',
    callbackFunction: 'A callback function is a function passed into another function to run later.\n\nExample:\nbutton.addEventListener("click", function() {\n  console.log("Clicked");\n});\n\nInterview line:\nCallbacks are common in events, array methods, and asynchronous code.',
    promise: 'A Promise represents a value that may be available now, later, or fail.\n\nExample:\nfetch("/applications")\n  .then((response) => response.json())\n  .then((data) => console.log(data));\n\nInterview line:\nPromises help manage asynchronous work without deeply nested callbacks.',
    asyncAwait: 'async/await is syntax for writing Promise-based code in a cleaner, step-by-step style.\n\nExample:\nasync function loadApplications() {\n  const response = await fetch("/applications");\n  return response.json();\n}\n\nInterview line:\nawait pauses inside an async function until the Promise settles.',
    eventLoop: 'The event loop is how JavaScript handles asynchronous tasks while staying single-threaded.\n\nExample:\nconsole.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");\n\nInterview line:\nThe event loop decides when callbacks from timers, promises, and events run after the call stack is clear.',
    scope: 'Scope controls where variables can be accessed in code.\n\nExample:\nfunction showRole() {\n  const role = "Frontend";\n  return role;\n}\n\nInterview line:\nScope prevents every variable from being available everywhere.',
    localScope: 'Local scope means a variable is only available inside the block or function where it is created.\n\nExample:\nfunction interview() {\n  const topic = "React";\n  return topic;\n}\n\nInterview line:\nLocal variables help avoid naming conflicts and keep logic contained.',
    globalScope: 'Global scope means a variable is available throughout the program.\n\nExample:\nconst appName = "JobTrack AI";\nfunction showName() {\n  return appName;\n}\n\nInterview line:\nGlobal variables are easy to access but should be used carefully to avoid accidental changes.',
  }

  return responses[intent] || exactTopicResponse('JavaScript')
}

const questionsResponse = (topic, target) => {
  if(topic === 'React state' || topic === 'React props'){
    return 'Practice these React questions.\n\n1. What is state in React?\n2. What are props in React?\n3. How are props and state different?\n4. When should data be state instead of props?\n5. How does changing state update the UI?\n\nPractical next step:\nAnswer props vs state out loud in under 60 seconds.'
  }
  const exactEntry = findExactDefinitionByTopic(topic)
  if(exactEntry){
    return `Practice these ${exactEntry.topic} interview questions.\n\n1. What is a ${exactEntry.topic}?\n2. Why is a ${exactEntry.topic} useful?\n3. Can you give a tiny code example?\n4. How would you explain it to a beginner?\n5. Where would you use it in a real project?\n\nPractical next step:\nAnswer question 1 using this line: ${exactEntry.definition}`
  }
  const lesson = topicLessons[topic] || topicLessons['Interview Preparation']
  const intro = target
    ? `Practice these for ${formatApplication(target)}.`
    : `Practice these ${topic} questions.`
  return `${intro}\n\n${lesson.questions.map((question, index) => `${index + 1}. ${question}`).join('\n')}\n\nPractical next step:\nAnswer each out loud in 60 seconds, then ask me to make them harder.`
}

const resumeResponse = (resume, applications) => {
  const target = applications.find((app) => app.status === 'Interview') || pickPriorityApplication(applications)
  return `Direct answer:\nUse ${resume?.name || 'No valid resume selected'} as the working resume for ${target ? formatApplication(target) : 'your next frontend or internship application'}.\n\nResume coaching:\n- Summary: name your target role clearly in the first line.\n- Skills: group Frontend, Backend, Tools, and Databases.\n- Projects: lead with your strongest software project and include technology plus outcome.\n- Keywords: mirror role terms like React, JavaScript, API calls, debugging, responsive design, and internship.\n\nPractical next step:\nRewrite one bullet as: Built [feature] using [tech] to achieve [result].`
}

const interviewResponse = (target) => {
  const role = compact(target?.role) || 'your target role'
  const isFrontend = /frontend|front-end|react|ui|software engineering|swe/i.test(role)
  const technical = isFrontend
    ? ['React components and reusable UI', 'props vs state', 'hooks such as useState and useEffect', 'API calls with loading/error states', 'debugging broken UI behavior', 'responsive design']
    : ['core role fundamentals', 'project architecture', 'data flow', 'debugging process', 'testing and edge cases', 'communication tradeoffs']

  return `Direct answer:\nPrepare for ${formatApplication(target)}${target?.applied ? ` on ${formatDate(target.applied)}` : ''} by focusing on the skills most likely to come up for ${role}.\n\nTechnical questions:\n${technical.map((item, index) => `${index + 1}. Explain ${item}.`).join('\n')}\n\nBehavioral questions:\n1. Tell me about a project you are proud of.\n2. Describe a difficult bug and how you solved it.\n3. Tell me about a time you learned something quickly.\n\nSTAR answer reminder:\nUse Situation, Task, Action, Result. Keep each answer under two minutes.\n\nPreparation plan:\n- 20 minutes: revise fundamentals.\n- 20 minutes: practice your strongest project story.\n- 10 minutes: research ${target?.company || 'the company'}.\n\nPractical next step:\nPractice your answer to "Walk me through your project" first.`
}

const followUpResponse = (target) => {
  if(!target){
    return 'Direct answer:\nAdd an application first so I can draft a specific recruiter follow-up.\n\nPractical next step:\nTrack the company, role, date, and current status, then ask me again.'
  }
  return `Direct answer:\nHere is a polished recruiter follow-up for ${formatApplication(target)}.\n\nSubject: Following up on ${target.role}\n\nHi ${target.company} team,\n\nI hope you are doing well. I wanted to follow up on my application for the ${target.role} role. I am still very interested in the opportunity and would be excited to contribute my software engineering project experience, problem-solving skills, and product-focused mindset.\n\nPlease let me know if there are any updates or next steps I should prepare for.\n\nBest,\nAleeza\n\nPractical next step:\nSend this if it has been 3-5 business days since applying or interviewing.`
}

const priorityResponse = (applications) => {
  const sorted = sortByPriority(applications)
  const top = sorted[0]
  if(!top){
    return 'Direct answer:\nAdd your first application so I can rank your pipeline.\n\nPractical next step:\nStart with one role you have applied to or want to save.'
  }

  return `Direct answer:\nPrioritize ${formatApplication(top)}.\n\nWhy this comes first:\n${top.status === 'Interview' ? '- It is in Interview, so preparation has the highest urgency.' : ''}
${top.status === 'Offer' ? '- It is in Offer, so you may need to decide, negotiate, or respond.' : ''}
${top.status === 'Applied' ? '- It is Applied, so follow-up and resume tailoring matter now.' : ''}
${top.status === 'Wishlist' ? '- It is saved but not submitted, so the next action is applying.' : ''}
${top.status === 'Rejected' ? '- It is closed, so use it for reflection rather than active effort.' : ''}\n\nPipeline order:\n${sorted.map((app, index) => `${index + 1}. ${app.company} - ${app.role} (${app.status})`).join('\n')}\n\nPractical next step:\nSpend 20 focused minutes on the first item before adding anything new.`
}

const coverLetterResponse = (target) => {
  const company = target?.company || 'Hiring Team'
  const role = target?.role || 'this opportunity'
  return `Direct answer:\nHere is a short cover letter draft for ${formatApplication(target)}.\n\nDear ${company} team,\n\nI am excited to apply for the ${role} role. My software engineering projects have helped me build practical experience with frontend development, debugging, responsive interfaces, and user-focused product thinking. I would be glad to bring curiosity, reliability, and strong learning momentum to your team.\n\nThank you for considering my application. I would welcome the opportunity to discuss how my skills and projects match your needs.\n\nSincerely,\nAleeza\n\nPractical next step:\nAdd one sentence naming a project that matches the job description.`
}

const weeklyPlanResponse = (applications, resume) => {
  const priority = pickPriorityApplication(applications)
  return `Direct answer:\nUse a focused weekly rhythm built around ${formatApplication(priority)}.\n\nMonday:\nReview your pipeline and choose the top priority.\n\nTuesday:\nTailor ${resume?.name || 'your resume'} to one role and apply or follow up.\n\nWednesday:\nPractice technical questions for ${priority?.role || 'your target role'}.\n\nThursday:\nSend recruiter follow-ups and update notes.\n\nFriday:\nReview outcomes, clean statuses, and plan next week.\n\nPractical next step:\nStart today with ${priority ? `${priority.company} because it is currently ${priority.status}.` : 'adding one application to your pipeline.'}`
}

const extractQuestionTopic = (message) => {
  const cleaned = String(message || '')
    .replace(/[?.!]/g, '')
    .replace(/\b(please|can you|could you|tell me|explain|define)\b/gi, '')
    .trim()
  const match = cleaned.match(/\b(?:what is|what are|how does|how do)\s+(.+)$/i)
  return compact(match?.[1] || cleaned || 'that topic')
}

const generalFallbackResponse = (message) => {
  const topic = extractQuestionTopic(message)
  return `Direct answer:\n${topic} is a topic you can understand by breaking it into purpose, use case, and one practical example.\n\nSimple explanation:\nStart with what ${topic} is used for, then connect it to a real project or programming problem.\n\nTiny study example:\n1. Write a one-line definition of ${topic}.\n2. Find one real use case.\n3. Practice explaining it in 30 seconds.\n\nInterview-style line:\nIf asked about ${topic}, give a clear definition first, then explain where you would use it and why it matters.`
}

const careerAdviceResponse = (applications, resumes, memory) => {
  const priority = pickPriorityApplication(applications)
  const resume = pickRecommendedResume(resumes)
  const topic = memory.learningTopic || memory.lastTopic
  return `Direct answer:\nYour best next move is one focused action: ${priority ? `work on ${formatApplication(priority)}` : 'add or update one application'}.\n\nCurrent context:\n- Applications tracked: ${applications.length}\n- Priority application: ${formatApplication(priority)}\n- Recommended resume: ${resume?.name || 'No valid resume selected'}${topic ? `\n- Current learning topic: ${topic}` : ''}\n\nPractical next step:\nAsk me for one of these: interview prep, React help, resume rewrite, recruiter follow-up, or a weekly plan.`
}

export function generateAiResponse(message, context, memory = createEmptyAiMemory()){
  const applications = context.applications || []
  const resumes = context.resumes || []
  const attachedResume = context.attachedResume || null
  const latest = pickLatestApplication(applications)
  const interviews = applications.filter((app) => app.status === 'Interview')
  const priority = pickPriorityApplication(applications)
  const resume = attachedResume || pickRecommendedResume(resumes)
  const detected = detectIntent(message, memory)
  console.log('Matched intent:', detected.intent)
  const target = interviews[0] || priority || latest
  const baseContext = {
    lastApplication: target || memory.lastApplication,
    lastResume: resume || memory.lastResume,
    interviewTarget: ['interview', 'behavioral', 'technical'].includes(detected.intent) ? target : memory.interviewTarget,
  }

  if(detected.intent === 'greeting'){
    return {
      text: 'Hi Aleeza, I am ready to coach you.\n\nI can teach React or JavaScript, prepare you for interviews, improve resumes, draft follow-ups, write cover letters, and prioritize applications.\n\nPractical next step:\nAsk me something specific like "What is React?", "Prepare me for NovaTech", or "Draft a follow-up email."',
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: 'career coaching'}, message),
    }
  }

  if(phraseIntents.some((item) => item.intent === detected.intent)){
    return {
      text: phraseIntentResponse(detected.intent),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: `learn ${detected.topic}`}, message),
    }
  }

  if(detected.intent === 'exactTopic'){
    return {
      text: exactTopicResponse(detected.topic),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: `learn ${detected.topic}`}, message),
    }
  }

  if(['learning', 'react', 'javascript', 'frontend', 'backend', 'html', 'css', 'api', 'linkedin'].includes(detected.intent)){
    return {
      text: lessonResponse(detected.topic),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: `learn ${detected.topic}`}, message),
    }
  }

  if(detected.intent === 'explainTopic'){
    return {
      text: findExactDefinitionByTopic(detected.topic)
        ? exactTopicResponse(detected.topic, detected.mode)
        : lessonResponse(detected.topic, detected.mode),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: `understand ${detected.topic}`}, message),
    }
  }

  if(detected.intent === 'technical'){
    return {
      text: questionsResponse(detected.topic, memory.interviewTarget || target),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: `practice ${detected.topic}`}, message),
    }
  }

  if(detected.intent === 'interview'){
    return {
      text: interviewResponse(target),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: 'interview preparation', learningTopic: 'Interview Preparation'}, message),
    }
  }

  if(detected.intent === 'behavioral'){
    return {
      text: `Direct answer:\nPrepare three STAR stories: one for debugging, one for teamwork, and one for learning quickly.\n\nSTAR framework:\n- Situation: set the context briefly.\n- Task: explain your responsibility.\n- Action: focus on what you did.\n- Result: share the outcome or what improved.\n\nFor ${formatApplication(memory.interviewTarget || target)}:\n1. Tell me about a difficult bug.\n2. Tell me about a time you worked with others.\n3. Tell me about a time you learned a new tool quickly.\n\nPractical next step:\nWrite the debugging story first because it works well for software roles.`,
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: 'behavioral interview prep'}, message),
    }
  }

  if(detected.intent === 'resume'){
    return {
      text: resumeResponse(resume, applications),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: 'resume improvement', learningTopic: 'Resume Writing'}, message),
    }
  }

  if(detected.intent === 'followUp'){
    return {
      text: followUpResponse(priority || latest),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: 'recruiter follow-up'}, message),
    }
  }

  if(detected.intent === 'priority'){
    return {
      text: priorityResponse(applications),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: 'application priority'}, message),
    }
  }

  if(detected.intent === 'coverLetter'){
    return {
      text: coverLetterResponse(priority || latest),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: 'cover letter'}, message),
    }
  }

  if(detected.intent === 'weeklyPlan'){
    return {
      text: weeklyPlanResponse(applications, resume),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: 'weekly job search plan'}, message),
    }
  }

  if(detected.intent === 'generalFallback'){
    return {
      text: generalFallbackResponse(message),
      memory: updateMemory(memory, detected, {...baseContext, currentGoal: 'general help'}, message),
    }
  }

  return {
    text: careerAdviceResponse(applications, resumes, memory),
    memory: updateMemory(memory, detected, baseContext, message),
  }
}
