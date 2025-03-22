---
nav: Components
group: Data Display
title: Mermaid
---

## Default

<code src="./demos/index.tsx" nopadding></code>

## Full Featured

<code src="./demos/FullFeatured.tsx" nopadding></code>

## Actions Render

<code src="./demos/ActionsRender.tsx"></code>

## Diagram Syntax

### Flowchart

```tsx
import { Mermaid } from '@lobehub/ui';

const flowchart = `flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
`;

export default () => {
  return <Mermaid>{flowchart}</Mermaid>;
};
```

### Sequence Diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const sequenceDiagram = `sequenceDiagram
    autonumber
    Alice->>John: Hello John, how are you?
    loop HealthCheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
`;

export default () => {
  return <Mermaid>{sequenceDiagram}</Mermaid>;
};
```

### Class Diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const classDiagram = `classDiagram
    note "From Duck till Zebra"
    Animal <|-- Duck
    note for Duck "can fly\\ncan swim\\ncan dive\\ncan help in debugging"
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
`;

export default () => {
  return <Mermaid>{classDiagram}</Mermaid>;
};
```

### State Diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const stateDiagram = `stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
 `;

export default () => {
  return <Mermaid>{stateDiagram}</Mermaid>;
};
```

### Entity Relationship Diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const erDiagram = `
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
`;

export default () => {
  return <Mermaid>{erDiagram}</Mermaid>;
};
```

### User Journey Diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const userJourney = `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me
`;

export default () => {
  return <Mermaid>{userJourney}</Mermaid>;
};
```

### Gantt

```tsx
import { Mermaid } from '@lobehub/ui';

const gantt = `gantt
    title A Gantt Diagram
    dateFormat YYYY-MM-DD
    section Section
        A task          :a1, 2014-01-01, 30d
        Another task    :after a1, 20d
    section Another
        Task in Another :2014-01-12, 12d
        another task    :24d
`;

export default () => {
  return <Mermaid>{gantt}</Mermaid>;
};
```

### Pie Chart

```tsx
import { Mermaid } from '@lobehub/ui';

const pie = `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
`;

export default () => {
  return <Mermaid>{pie}</Mermaid>;
};
```

### Quadrant Chart

```tsx
import { Mermaid } from '@lobehub/ui';

const quadrantChart = `quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
`;

export default () => {
  return <Mermaid>{quadrantChart}</Mermaid>;
};
```

### Requirement Diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const requirementDiagram = `requirementDiagram

    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req
`;

export default () => {
  return <Mermaid>{requirementDiagram}</Mermaid>;
};
```

### Gitgraph Diagrams

```tsx
import { Mermaid } from '@lobehub/ui';

const gitGraph = `gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
`;

export default () => {
  return <Mermaid>{gitGraph}</Mermaid>;
};
```

### Mindmap

```tsx
import { Mermaid } from '@lobehub/ui';

const mindmap = `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
`;

export default () => {
  return <Mermaid>{mindmap}</Mermaid>;
};
```

### Timeline Diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const timeline = `timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : YouTube
    2006 : Twitter
`;

export default () => {
  return <Mermaid>{timeline}</Mermaid>;
};
```

### Sankey diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const sankey = `sankey-beta

%% source,target,value
Electricity grid,Over generation / exports,104.453
Electricity grid,Heating and cooling - homes,113.726
Electricity grid,H2 conversion,27.14
`;

export default () => {
  return <Mermaid>{sankey}</Mermaid>;
};
```

### XY Chart

```tsx
import { Mermaid } from '@lobehub/ui';

const xychart = `xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]

`;

export default () => {
  return <Mermaid>{xychart}</Mermaid>;
};
```

### Block Diagrams Documentation

```tsx
import { Mermaid } from '@lobehub/ui';

const block = `block-beta
columns 1
  db(("DB"))
  blockArrowId6<["&nbsp;&nbsp;&nbsp;"]>(down)
  block:ID
    A
    B["A wide one in the middle"]
    C
  end
  space
  D
  ID --> D
  C --> D
  style B fill:#969,stroke:#333,stroke-width:4px
`;

export default () => {
  return <Mermaid>{block}</Mermaid>;
};
```

### Packet Diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const packet = `packet-beta
0-15: "Source Port"
16-31: "Destination Port"
32-63: "Sequence Number"
64-95: "Acknowledgment Number"
96-99: "Data Offset"
100-105: "Reserved"
106: "URG"
107: "ACK"
108: "PSH"
109: "RST"
110: "SYN"
111: "FIN"
112-127: "Window"
128-143: "Checksum"
144-159: "Urgent Pointer"
160-191: "(Options and Padding)"
192-255: "Data (variable length)"
`;

export default () => {
  return <Mermaid>{packet}</Mermaid>;
};
```

### Kanban Diagram

```tsx
import { Mermaid } from '@lobehub/ui';

const kanban = `kanban
  column1[Column Title]
    task1[Task Description]
`;

export default () => {
  return <Mermaid>{kanban}</Mermaid>;
};
```

### Architecture Diagrams

```tsx
import { Mermaid } from '@lobehub/ui';

const architecture = `architecture-beta
    group api(cloud)[API]

    service db(database)[Database] in api
    service disk1(disk)[Storage] in api
    service disk2(disk)[Storage] in api
    service server(server)[Server] in api

    db:L -- R:server
    disk1:T -- B:server
    disk2:T -- B:db
`;

export default () => {
  return <Mermaid>{architecture}</Mermaid>;
};
```

## APIs

<API></API>
