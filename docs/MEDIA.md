# Afterlife Bureau demo media

These assets were produced for the owner-private hackathon demonstration. The public source repository should include this production record, the script and captions, but exclude generated audio, video and their derived poster frames until redistribution rights are verified. Generated media is not covered by the application's source-code licence.

## Assets and credits

| Asset | Creation | Notes |
| --- | --- | --- |
| `bureau-trailer.mp4` | Local FFmpeg composition | Original illustration with a real Grok-generated scene at 8.48–14.48 seconds; ElevenLabs narration and Eleven Music soundtrack. |
| `umbrella-awakening.mp4` | Duomi API, `grok-video-1.5` | Six seconds at 720p. Provider-generated audio discarded. |
| `umbrella-poster.jpg` | Frame from the Grok clip | Poster only, same rights status as its source clip. |
| `bureau-narration.mp3` | ElevenLabs `eleven_v4`, Daniel | Original script in `pitch-script.txt`; individual beats in `voice/`. |
| `bureau-score.mp3` | ElevenLabs Eleven Music | Forty-second instrumental. Song ID `PHN8FzgurgCAm0p7j1AG`. See `music_license.md`. |
| `bureau-trailer.vtt` | Authored script and measured beat durations | Captions match the narrated film. |
| `manifest.json` | Production metadata | Contains provenance and technical checks, no API credentials. |

Suggested visible credit: **Original AI artwork, Grok animation via Duomi, and ElevenLabs narration and music for Afterlife Bureau.**

The main film uses generated scene video as well as a locally animated illustration. Its character artwork and story are original fiction inspired by object-spirit folklore; they are not a historical depiction or a factual claim about Japanese beliefs.

## Creative prompts

### Character illustration

Create one wide landscape editorial illustration for Afterlife Bureau, a whimsical Japanese-inspired bureau for forgotten objects. Three charming original object spirits stand together: a large faded vermilion paper umbrella with one expressive eye and two skinny legs on the left, a small sage green dented kettle with sleepy eyes and tiny feet in the middle, a mustard yellow vintage table lamp with a gentle face on the right. Gentle mischievous emotion, lovely sophisticated hand-painted gouache, Japanese woodblock ink line details, textured matte rice paper, limited muted palette charcoal, brick red, sage and golden ochre. Light warm cream background #f5f0e6, generous breathing room, full body all characters visible. A few small charcoal star sparks and muted round shadow below. Composition horizontal 3:2. No text, no lettering, no labels, no UI. Stylish indie illustration with character and tactile grain, not 3D, not anime, not generic clipart.

### Generated scene

An original 8 second animated miniature. A forgotten faded vermilion paper umbrella rests alone on warm cream rice paper. Its single friendly eye opens, two tiny ink-black legs gently unfold, and the umbrella does a shy joyful hop. A sage green kettle with sleepy eyes joins it at the edge of the frame. A few tiny golden star sparks drift upward. Sophisticated hand-painted gouache and Japanese woodblock ink line texture, muted vermilion, sage and ochre, tactile paper grain, charming indie animation. Fixed camera, full objects visible, warm gentle light, plain cream background. No text, no typography, no logos, no dialogue. End on a happy still pose with space for a caption.

The prompt described eight seconds; the successful Grok request explicitly selected six seconds and the result is 6.04 seconds. The initial VEO request timed out and the provider reported a refund; no VEO output is used.

### Delivered score

Original whimsical instrumental underscore for a tiny magical bureau giving forgotten household objects a second chance: gentle pizzicato strings, felt piano, soft marimba, delicate wooden percussion, warm curious then hopeful mood. No vocals, no speech, no lyrics. Leave room for a spoken demo voice.

Requested length: 40,000 milliseconds. Instrumental: true. No artist names, existing song titles or borrowed lyrics were requested.

## Release status

Commercial media permission and permission to redistribute raw assets in an open-source repository are separate questions. The actual ElevenLabs account plan, generated music model version, and raw-media redistribution rights have not been verified here. Duomi's downstream rights for the Grok result have also not been verified. Keep the binaries in the private demonstration deployment and exclude them from the public source release pending verification.

A Suno draft was generated successfully but excluded from the delivery folder following the source repository's internal-review-only rule.
