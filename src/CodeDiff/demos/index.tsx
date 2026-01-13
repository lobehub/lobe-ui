import { CodeDiff } from '../CodeDiff';

const oldCode = `function greet(name) {
  console.log("Hello, " + name);
  return name;
}

const user = "World";
greet(user);`;

const newCode = `function greet(name: string): string {
  console.log(\`Hello, \${name}!\`);
  return name.toUpperCase();
}

const user: string = "World";
const result = greet(user);
console.log(result);`;

export default () => {
  return (
    <CodeDiff
      fileName="greeting.ts"
      language="typescript"
      newContent={newCode}
      oldContent={oldCode}
    />
  );
};
