const fuzz = require('fuzzball');

const DEFAULT_THRESHOLD = 60;
const DEFAULT_LIMIT = 10;

function similarity(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return 0;
  }
  return fuzz.ratio(a, b);
}

function partialSimilarity(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return 0;
  }
  return fuzz.partial_ratio(a, b);
}

function tokenSimilarity(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return 0;
  }
  return fuzz.token_set_ratio(a, b);
}

function isMatch(a, b, threshold = DEFAULT_THRESHOLD) {
  return similarity(a, b) >= threshold;
}

function bestMatch(query, choices) {
  if (typeof query !== 'string' || !Array.isArray(choices) || choices.length === 0) {
    return null;
  }
  const result = fuzz.extract(query, choices, { scorer: fuzz.token_set_ratio, limit: 1 });
  if (result.length === 0) {
    return null;
  }
  const [value, score, index] = result[0];
  return { value, score, index };
}

function search(query, choices, options = {}) {
  if (typeof query !== 'string' || !Array.isArray(choices)) {
    return [];
  }
  const {
    limit = DEFAULT_LIMIT,
    threshold = DEFAULT_THRESHOLD,
    scorer = fuzz.token_set_ratio,
  } = options;

  const results = fuzz.extract(query, choices, { scorer, limit });
  return results
    .filter(([, score]) => score >= threshold)
    .map(([value, score, index]) => ({ value, score, index }));
}

module.exports = {
  similarity,
  partialSimilarity,
  tokenSimilarity,
  isMatch,
  bestMatch,
  search,
};
