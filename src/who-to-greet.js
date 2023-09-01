let whom_to_greet = '';

const names = [
  'James',
  'Mary',
  'Robert',
  'Patricia',
  'John',
  'Jennifer',
  'Michael',
  'Linda',
  'David',
  'Elizabeth',
  'William',
  'Barbara',
  'Richard',
  'Susan',
];

export function reset_who_to_greet() {
  whom_to_greet = names[Math.floor(Math.random() * names.length)];
  return whom_to_greet;
}

reset_who_to_greet();

export default function() {
  return whom_to_greet;
}
