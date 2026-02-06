import { ActionIconGroup } from '@lobehub/ui';
import { ChatItem } from '@lobehub/ui/chat';
import { useState } from 'react';

import { avatar, dropdownMenu, items } from './data';

const message = `| 序号 | 文献标题 | 作者 | 发表年份 | 期刊/来源 | 引用次数 | 内容摘要 |
|-----|-------------|-----|---------|----------|---------|--------|
| 1 | [More Similar Values, More Trust? -- the Effect of Value Similarity on Trust in Human-Agent Interaction](http://arxiv.org/abs/2105.09222v1) | Mehrotra, Jonker, Tielman | 2021 | AAAI/ACM Conference on AI, Ethics, and Society | 不详 | 研究价值观相似性如何影响人类对AI代理的信任 |
| 2 | [Tell Me Something That Will Help Me Trust You: A Survey of Trust Calibration in Human-Agent Interaction](http://arxiv.org/abs/2205.02987v1) | Cancro, Pan, Foulds | 2022 | arXiv | 不详 | 综述人类与智能代理之间信任校准的相关研究 |
| 3 | [Empathetic Conversational Agents: Utilizing Neural and Physiological Signals for Enhanced Empathetic Interactions](http://arxiv.org/abs/2501.08393v1) | Saffaryazdi et al. | 2025 | arXiv | 不详 | 探索将神经和生理信号整合到会话代理中以增强共情互动 |
| 4 | [Engagement in Human-Agent Interaction: An Overview](https://pmc.ncbi.nlm.nih.gov/articles/PMC7806067/) | Oertel et al. | 2020 | Frontiers in Robotics and AI | 149+ | 综述人机交互中参与度的定义、检测和生成方法 |
| 5 | [COLLAGE: Collaborative Human-Agent Interaction Generation using Hierarchical Latent Diffusion and Language Models](https://arxiv.org/html/2409.20502v1) | Daiya, Conover, Bera | 2024 | arXiv | 不详 | 提出生成协作式代理-物体-代理交互的新框架 |
| 6 | [Evaluating Multimodal Interactive Agents](http://arxiv.org/abs/2205.13274v2) | 不详 | 2022 | arXiv | 不详 | 提出标准化测试套件(STS)评估交互式代理的新方法 |
| 7 | [Improving Model Understanding and Trust with Counterfactual Explanations of Model Confidence](http://arxiv.org/abs/2206.02790v1) | 不详 | 2022 | arXiv | 不详 | 展示反事实解释如何帮助用户更好理解和信任AI模型预测 |
| 8 | [Assessing Human Interaction in Virtual Reality With Continually Learning Prediction Agents](http://arxiv.org/abs/2112.07774v2) | 不详 | 2021 | arXiv | 不详 | 研究人类与持续学习预测代理在VR环境中的交互发展 |
| 9 | [Warmth and competence in human-agent cooperation](http://arxiv.org/abs/2201.13448v4) | 不详 | 2022 | arXiv | 不详 | 研究主观偏好在人类-代理合作中的影响因素 |
| 10 | [Human-Agent Interaction in Synthetic Social Networks: A Framework for Studying Online Polarization](http://arxiv.org/abs/2502.01340v2) | 不详 | 2025 | arXiv | 不详 | 提出结合数学精确性和自然语言能力的计算框架研究在线极化 |
| 11 | [On the Effect of Robot Errors on Human Teaching Dynamics](http://arxiv.org/abs/2409.09827v1) | 不详 | 2024 | arXiv | 不详 | 探究机器人错误如何影响人类教学动态的多个维度 |
| 12 | [TIP: A Trust Inference and Propagation Model in Multi-Human Multi-Robot Teams](http://arxiv.org/abs/2301.10928v1) | 不详 | 2023 | arXiv | 不详 | 提出多人类多机器人团队中的信任推理和传播模型 |`;
export default () => {
  const [edit, setEdit] = useState(false);

  return (
    <ChatItem
      avatar={avatar}
      editing={edit}
      message={message}
      actions={
        <ActionIconGroup
          items={items}
          menu={dropdownMenu}
          onActionClick={(action) => {
            if (action.key === 'edit') {
              setEdit(true);
            }
          }}
        />
      }
    />
  );
};
