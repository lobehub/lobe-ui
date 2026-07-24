import { Mermaid } from '@lobehub/ui';

const flowchartWithHtmlLabels = `flowchart LR
    subgraph "Step 1: 细胞动员"
        A["G-CSF 启动<br>化疗前24h（d-1/d0）"]
        B["使G0期白血病细胞<br>同步进入S期（DNA合成期）"]
    end
    subgraph "Step 2: 药物靶向杀伤"
        C["低剂量Ara-C<br>（S期特异性）<br>10mg/m² q12h"]
        D["阿克拉霉素<br>（嵌入DNA碱基对）<br>10-14mg/m²/d"]
    end
    subgraph "Step 3: 协同效应"
        E["G0期细胞比例↓<br>S期→G2期滞留↑<br>对阿糖胞苷敏感性↑"]
        F["正常干细胞保护<br>（G-CSF同时促进<br>正常髓系恢复）"]
    end

    A -->|"细胞周期同步"| B
    B --> C
    B --> D
    C --> E
    D --> E
    A --> F
`;

export default () => {
  return <Mermaid>{flowchartWithHtmlLabels}</Mermaid>;
};
