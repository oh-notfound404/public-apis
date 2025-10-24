const meta = {
  name: "birdfact",
  version: "1.0.0",
  description: "Get a random bird fact",
  author: "Developer",
  method: "get",
  category: "random",
  path: "/birdfact"
};

const birdFacts = [
  "Owls can rotate their heads up to 270 degrees.",
  "Hummingbirds are the only birds that can fly backward.",
  "A group of flamingos is called a 'flamboyance'.",
  "Penguins can drink seawater.",
  "The fastest bird is the peregrine falcon, diving at over 240 mph.",
  "Emus can't walk backward.",
  "The ostrich is the largest living bird.",
  "Kiwi birds are blind and rely on smell to find food.",
  "Parrots can mimic human speech.",
  "Pigeons can recognize themselves in a mirror.",
  "The Arctic tern migrates about 44,000 miles a year.",
  "Male emperor penguins incubate eggs on their feet.",
  "Woodpeckers can peck up to 20 times per second.",
  "The lyrebird can imitate chainsaws, camera shutters, and other birds.",
  "Cardinals cover themselves in ants to get rid of parasites.",
  "Crows are known to hold grudges against specific people.",
  "Some ducks sleep with one eye open.",
  "A baby puffin is called a puffling.",
  "Birds don't urinate; they excrete uric acid instead of urea.",
  "The bee hummingbird is the smallest bird, only 2.2 inches long.",
  "Turkeys can blush.",
  "Ravens can solve puzzles and plan for future events.",
  "Pigeons were used as message carriers during wars.",
  "Chickens dream just like humans do.",
  "The albatross can sleep while flying.",
  "Owls have three eyelids: one for blinking, one for sleeping, and one for cleaning.",
  "Some birds use tools to extract insects from tree bark.",
  "Birds have hollow bones to help them fly.",
  "The heart of a hummingbird beats up to 1,260 times per minute.",
  "Flamingos are pink because of the shrimp they eat.",
  "The horned screamer has a horn-like projection on its head.",
  "Male lyrebirds build stages and sing to attract mates.",
  "African grey parrots are among the smartest birds.",
  "Snowy owls can hunt during the day.",
  "Some birds navigate using the Earth's magnetic field.",
  "Vultures use their sense of smell to find carrion.",
  "Penguins mate for life.",
  "Chickens have more bones in their neck than giraffes.",
  "Mockingbirds can imitate over 200 sounds.",
  "The cassowary is one of the most dangerous birds to humans.",
  "Robins can hear worms underground.",
  "Swifts can stay airborne for up to 10 months without landing.",
  "Some species of birds can see ultraviolet light.",
  "The secretary bird kills snakes by stomping them.",
  "Peacocks fan out their tail feathers to attract mates.",
  "The hoatzin chick has claws on its wings.",
  "Eagles have eyesight up to eight times sharper than humans.",
  "Birds were the only dinosaurs to survive the mass extinction.",
  "There are over 10,000 species of birds worldwide."
];

async function onStart({ _, res }) {
  try {
    const randomFact = birdFacts[Math.floor(Math.random() * birdFacts.length)];
    res.status(200).json({ fact: randomFact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { meta, onStart };