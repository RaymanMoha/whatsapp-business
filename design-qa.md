# AppBase FAQ portrait design QA

- Source visual truth: `/Users/moses/Library/Containers/com.apple.Preview/Data/tmp/PreviewTemp-6dMG0N/UntitledFileBeingShared-tDqzsq/Untitled 5.png`
- Implementation screenshot: `/Users/moses/Downloads/whatsapp-business-cart/qa-faq-grounded.png`
- Combined comparison: `/Users/moses/Downloads/whatsapp-business-cart/design-qa-comparison.png`
- Viewport: 780 x 1000 in-app browser capture; source evidence is the user's 1792 x 955 desktop capture
- Route and state: `/#questions`, desktop, first FAQ open

## Full-view comparison evidence

The source capture showed the portrait translated across the FAQ boundary, leaving it visually detached from the copy and partially floating over the pricing transition. The revised capture keeps the merchant portrait in the left FAQ column, aligns its bottom edge precisely with the section boundary and restores the pricing section's distinct background.

## Focused-region comparison evidence

The combined comparison was inspected for the portrait baseline, subject crop, section transition, headline alignment and accordion height. The portrait now uses a dedicated waist-up asset rather than CSS-cropping the full-body image. Its flat `#FEFBF4` background matches the FAQ section and its right-facing gaze directs attention toward the questions.

## Findings

- [Resolved P1] Portrait floated outside the FAQ section when the accordion height changed. The image now uses `mt-auto` inside the left flex column and no transform, keeping it bottom-aligned for every accordion state.
- [Resolved P1] Multiple expanded answers could make the portrait appear stranded mid-column. All FAQ details now share `name="appbase-faq"`, creating a native one-at-a-time accordion.
- [Resolved P2] The original full-body portrait required an awkward crop. It was replaced with a purpose-built waist-up editorial asset sized for the 390px column.
- [Resolved P2] The FAQ and image backgrounds differed slightly. Both now use the portrait's measured warm ivory `#FEFBF4`; pricing returns to `#F6F4ED` for a clean boundary.

## Required fidelity surfaces

- Typography: existing Bricolage Grotesque hierarchy, wrapping and weights remain unchanged.
- Spacing and layout: portrait is bottom-anchored, contained and aligned to the next-section rule.
- Colors and tokens: forest green, acid green and warm ivory remain consistent; the pricing transition is visually distinct.
- Image quality: dedicated 1159 x 1358 raster asset, correct intrinsic ratio and responsive Next Image delivery; no placeholder or CSS-drawn asset.
- Copy: FAQ and Kenya-specific copy are unchanged. WhatsApp CTAs now begin with the requested merchant-demo message.

## Comparison history

1. Initial source evidence: full-body portrait appeared small inside a tall unmatched rectangle.
2. First revision: larger CSS crop removed excess space but cut the subject's head.
3. Second revision: a purpose-made waist-up portrait fixed the crop, but translated overlap made it float across the pricing boundary.
4. Final revision: transform removed, portrait bottom-anchored, pricing background restored and accordion limited to one open item. The combined post-fix comparison shows no remaining P0, P1 or P2 issue in the target region.

final result: passed
