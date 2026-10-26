# Open-source reuse and evaluation

Evaluated on 2026-10-26. Revisions below identify the source inspected; they do not claim that every upstream feature was installed or integrated.

| Project                                             | Inspected revision                         | Licence at that revision                             | Role                                                                                                                                |
| --------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [Anatomy](https://github.com/wheresryan22/anatomy)  | `1482e8469b0a9e0d8cc18ea2740a01423d29ae80` | MIT, copyright 2026 Ryan                             | Selected toolkit/workflow for an interactive explanation of the bureau.                                                             |
| [PPT Master](https://github.com/hugohe3/ppt-master) | `78759bf62e9a1ef43e926ff9e50afa4cfe9a63cb` | MIT, copyright 2025–2026 Hugo He                     | Evaluated external authoring workflow for a future editable pitch deck. No PPTX produced.                                           |
| [ai-api-lab](https://github.com/ku2055/ai-api-lab)  | `60d25de6b4a3d349796084a8098c7da037d92756` | No root licence file found in the inspected checkout | Owner-provided, external production tooling used to generate private demonstration media. No blanket public reuse licence inferred. |

## Anatomy: interactive explanation

Anatomy combines an agent skill with an isometric drawing kit. Its core provides SVG geometry, shaded parts and an isometric camera; optional modules support React, WebGL and 3D. The drawing kit can be used to produce an interactive figure. The skill itself is build-time guidance, not an AI service running inside the web page.

Its useful contribution here is making the process tangible: photo and memory enter a fictional bureau, the story is created or selected, then a practical next-step card leaves the bureau. This is an explanatory metaphor. It must not suggest that the interface simulates the actual model internals or that a sample animation constitutes live inference.

The selected implementation should preserve ordinary controls, keyboard access and a readable explanation without optional WebGL effects. Retain the upstream MIT notice with copied or substantially adapted kit code. React and any other dependencies keep their own licences.

## PPT Master: editable deck authoring, not a web runtime

PPT Master is an agent workflow with Python authoring and validation tools. It compiles supported SVG elements into native DrawingML PowerPoint objects. It is not a React presentation component, hosted slide-generation API or browser collaboration system.

A useful future deliverable would be six 16:9 slides based on [the proposed outline](PITCH-OUTLINE.md), with native editable text, shapes and connectors. Plain-text content and native geometry can be authored and exported locally without a paid image or speech request. That would be a separate artifact from the current web demonstration.

The inspected environment did not have `python-pptx` installed. It is required for export. Other requirements depend on chosen features: XlsxWriter for workbook-backed charts; `skia-pathops` and `uharfbuzz` for relevant shape/text operations. The full requirements file also lists optional import and media tools. PDF intake uses PyMuPDF under AGPL; a deck built from our existing Markdown and original vectors does not need that intake path.

### Route and confirmation requirements

Read upstream `AGENTS.md`, then `skills/ppt-master/SKILL.md`; run its attribution integrity guard and follow `workflows/routing.md`. The inspected attribution check passed, but no generation route was executed.

The ordinary Generate route includes a Stage-1 communication and template confirmation before slide authoring. The Quick profile is only selected for an explicit quick/fast, skip-strategy or direct SVG-to-PPTX request. Evaluating or adding open-source improvements does not, by itself, select Quick. The skill also assigns page authoring to the main agent.

Accordingly, this change prepares the outline and evaluates the tooling. It does not skip a confirmation gate, install PPT Master into the application, add its Python dependencies, run its exporter or claim a completed downloadable PowerPoint. Any later deck run should select the proper route from that later brief and pass its SVG quality checks before export.

Keep PPT Master external or pin any vendored subset to an explicit revision. Preserve Hugo He's MIT notice in copied or substantial portions. Bundled icon collections have separate third-party notices; do not assume the repository's MIT licence covers every imported asset or optional dependency.

## ai-api-lab: production tooling and provider boundaries

The external Python clients supplied authenticated Duomi and ElevenLabs requests for the private demo media. Credentials were read from the owner's secret store and kept out of source and browser code. The production guidance distinguishes internal Suno drafts from deliverable Eleven Music assets, avoids Kling, and limits request bursts.

These clients are production tools; they are not bundled into the mobile web app. The web app's live character path uses its own server-side OpenRouter integration. No ai-api-lab licence grant was inferred from repository visibility or ownership.

Generated-media rights are separate from software licences. Public GitHub source excludes generated audio/video pending verification; see [the media rights record](MEDIA-RIGHTS.md). An MIT toolkit licence does not clear third-party music, voices, videos, photographs or logos.
