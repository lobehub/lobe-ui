import * as commitAnalyzer from '@semantic-release/commit-analyzer';
import * as releaseNotesGenerator from '@semantic-release/release-notes-generator';

const HEADER_SCOPE = /^(?:\S+\s+)?\w+\(([^)]*)\)!?:/u;

const scopeOf = (message = '') => HEADER_SCOPE.exec(message.split('\n', 1)[0])?.[1] ?? '';

export const selectCommits = ({ exclude = false, scopes = [] }, commits) =>
  commits.filter((commit) => scopes.includes(scopeOf(commit.message)) !== exclude);

export const analyzeCommits = (config, context) =>
  commitAnalyzer.analyzeCommits(config, {
    ...context,
    commits: selectCommits(config, context.commits),
  });

export const generateNotes = (config, context) =>
  releaseNotesGenerator.generateNotes(config, {
    ...context,
    commits: selectCommits(config, context.commits),
  });
