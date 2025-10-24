const meta = {
  name: "devquote",
  path: "/devquote",
  method: "get",
  category: "random"
};

const quotes = [
  "Programming is the art of math one debug at a time.",
  "Code is like poetry — if it doesn't run, it's probably wrong.",
  "Before you code, think the logic.",
  "To break or not to compile, that is the test.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their bugs.",
  "In order to be irreplaceable, one must always be different.",
  "Java is to JavaScript what car is to Carpet.",
  "Knowledge is power, but enthusiasm pulls the switch.",
  "Fix the cause, not the symptom.",
  "Optimism is an occupational hazard of programming.",
  "When debugging, novices insert corrective code; experts remove defective code.",
  "Before software can be reusable it first has to be usable.",
  "Make it work, make it right, make it fast.",
  "Programming isn't about what you know; it's about what you can figure out.",
  "A good programmer is someone who always looks both ways before crossing a one-way street.",
  "Simplicity is the soul of efficiency.",
  "Code never lies, comments sometimes do.",
  "Deleted code is debugged code.",
  "The best error message is the one that never shows up.",
  "Weeks of coding can save you hours of planning.",
  "You can’t have great software without a great team.",
  "Good code is its own best documentation.",
  "Programming is the art of algorithm design and the craft of debugging errant code.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "The most disastrous thing that you can ever learn is your first programming language.",
  "The best way to get a project done faster is to start sooner.",
  "If debugging is the process of removing bugs, then programming must be the process of putting them in.",
  "Programs must be written for people to read, and only incidentally for machines to execute.",
  "It works on my machine.",
  "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
  "Programming is not about typing, it's about thinking.",
  "A user interface is like a joke. If you have to explain it, it's not that good.",
  "The code you write makes you a programmer. The code you delete makes you a good one.",
  "Software testing is a sport like hunting, it’s bug-hunting.",
  "The trouble with programmers is that you can never tell what a programmer is doing until it’s too late.",
  "To iterate is human, to recurse divine.",
  "Computers are fast; developers keep them slow.",
  "Talk is cheap. Show me the code.",
  "There is no place like 127.0.0.1.",
  "It's not a bug – it's an undocumented feature.",
  "Good software, like wine, takes time.",
  "The best programs are the ones written when the programmer is supposed to be working on something else.",
  "You miss 100% of the bugs you don’t test for.",
  "Real programmers count from 0.",
  "Hack the planet!",
  "A great programmer is not measured by how much code they write, but by how much code they don’t have to.",
  "Behind every great program is a frustrated programmer.",
  "Code hard or go home.",
  "Stay hungry, stay coding.",
  "A good developer writes simple code, a great one writes elegant code."
];

async function onStart({ res }) {
  try {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: random });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch a quote." });
  }
}

module.exports = { meta, onStart };