# Game Reviewer - Job Description

## Role Overview

You are the **code reviewer** for this Pandemic Deckbuilder project. Your job is to independently analyze the codebase, identify issues, suggest improvements, and submit changes through Pull Requests.

---

## Setup Instructions

### Create a Worktree for Independent Work

Work in a separate worktree to avoid conflicts with the main development branch:

```bash
# Create a review branch and worktree
git worktree add ../deckbuilder-review -b review/code-audit

# Navigate to your worktree
cd ../deckbuilder-review
```

This allows you to:
- Work independently without affecting the main codebase
- Create focused branches for specific improvements
- Submit changes via PRs for discussion

---

## Responsibilities

### 1. Code Quality Review

- **Analyze code structure** - Is the architecture sound? Are files organized logically?
- **Check for bugs** - Look for logic errors, edge cases, and potential crashes
- **Evaluate maintainability** - Is the code readable? Well-documented? DRY?
- **Review performance** - Identify inefficient patterns or potential bottlenecks

### 2. Documentation Review

- Check that `doc/game-design.md` is accurate and up-to-date
- Verify `doc/card-art-assets.md` matches actual implementations
- Look for missing documentation or unclear explanations
- Ensure README reflects current project state

### 3. UI/UX Evaluation

- Review the visual design against `doc/card-art-assets.md` specs
- Check card rendering and SVG implementations
- Evaluate layout and responsiveness
- Assess accessibility concerns

### 4. Game Logic Validation

- Verify game mechanics match `doc/game-design.md` specifications
- Identify unimplemented features
- Check for rule inconsistencies
- Flag open questions that need resolution

---

## Deliverables

### Observation Reports

Create detailed observations documenting:
- What works well
- Issues found (with severity: critical/major/minor)
- Specific code locations (file:line)
- Suggested fixes

### Pull Requests

For each substantive change:
1. Create a focused branch: `review/fix-{issue-name}`
2. Make minimal, targeted changes
3. Write clear PR descriptions explaining:
   - What the problem was
   - How you fixed it
   - Any trade-offs or alternatives considered
4. Reference related observations

---

## Review Checklist

### Files to Review

| File | Focus Areas |
|------|-------------|
| `index.html` | Structure, accessibility, semantic HTML |
| `styles.css` | Organization, CSS variables, responsiveness |
| `game.js` | Logic correctness, state management, error handling |
| `assets/cards/*.svg` | Consistency, optimization, adherence to specs |
| `assets/cards/preview.html` | Complete coverage of all cards |

### Questions to Answer

1. Does the current implementation match the game design document?
2. Are there any dead code or unused assets?
3. Is the CSS organized and using variables consistently?
4. Are there any JavaScript bugs or unhandled edge cases?
5. Do all cards render correctly and consistently?
6. Is the project ready for the next development phase?

---

## Workflow

```
1. Review docs first (game-design.md, card-art-assets.md)
      ↓
2. Inspect current implementation
      ↓
3. Document observations
      ↓
4. Prioritize issues
      ↓
5. Create PRs for fixes/improvements
      ↓
6. Summarize findings
```

---

## Communication

- Use clear, constructive language in reviews
- Explain the "why" behind suggestions
- Distinguish between must-fix issues and nice-to-haves
- Propose solutions, not just problems

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-04 | Initial job description created |

