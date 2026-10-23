# HKA reference analysis / Liftco adaptation

Inspected 22 October 2026. Design source: https://hka.co.id/. Content source: https://liftcoindoperkasa.co.id/. Initial analysis precedes application implementation.

## Evidence and limitations

Rendered HKA homepage, About, Products, Services, Articles, Contact, representative product detail and branch pages were inspected during planning. Desktop and mobile homepage screenshots were visually reviewed, together with desktop inner-page captures. The browser challenge intermittently prevents fresh navigation; these are not successful reference captures. Failed challenge captures are retained under `screenshots/reference/blocked/`. Resizing the reference's Owl carousel can leave stale slide widths. Do not reproduce this bug or mistake a disrupted frame for the intended composition. Reference images sometimes remain lazy/unloaded; blank areas are not design decisions.

Initial successful captures are archived alongside subsequent validated captures. Screenshot filenames indicate viewport where measured. Supplemental measurements must verify the current URL/title, viewport and loaded content. Browser rendering, not text extraction alone, establishes visual observations.

## Shared visual system

- Inter throughout. Desktop hero: 64px, weight 600, line-height 76.8px, measured 834px text width. Section headings: 40px/50px, weight 600, -0.5px letter spacing. Body: 16px/25.6px. Navigation: approximately 14.4px/20px, weight 500, uppercase. Contact header block measured 288px at 1920px (15vw).
- Main boxed content max-width 1200px; approximately 112px left content edge in a 1440px window including scrollbar. Major desktop white-section gaps approximately 120px. Sharp corners, very restrained borders/shadows, small uppercase labels and fine arrow links.
- HKA dark blue is approximately #03256C, with yellow accents and white/light-gray surfaces. These identity colors are replaced with Liftco navy #103178, logo blue #0A45BD and logo red #EA0500. Contrast-safe white text replaces yellow-on-blue styling. The official logo's blue/red pixels were sampled; no HKA identity asset is shipped to public/.
- White 80px desktop header: logo left, spaced uppercase navigation, contact block flush right. Mobile uses a compact white header with logo and square dark menu control. Observed scrolled captures retain header visibility; reproduce a sticky header without copying the reference's incidental rendering bugs.
- At 768px navigation is mobile. Tablet hero typography approximately 42px/50.4px; at 390px approximately 28px/33.6px. Mobile horizontal padding approximately 16px. Desktop columns stack rather than shrink. Keep content from overflowing even where the reference has a stale oversized slide.

## Homepage sequence and composition

1. White navigation; no invented language switch for an Indonesian-only website.
2. Full-bleed photographic hero, text low-left, dark branded bottom-gradient overlay. Three looping slides, 5000ms autoplay, approximately 1000ms transition, dots, no visible desktop arrow controls. Text arrow links rather than pill buttons. Desktop measured hero follows viewport height; mobile hero approximately 60vh.
3. Dark services section: heading left, description right, then four adjacent light rectangular numbered panels. Alternate accents, shared dividers, no detached rounded cards. Approximately 650px total desktop height including generous spacing.
4. White About: two asymmetric columns, heading and taller image left; two paragraphs and shorter landscape image right. Subtle dotted motif, no invented blobs.
5. Dark featured-products section: heading and all-products link, eight flat light cards in four desktop columns/two rows. Tall image area, small brand/category metadata, title and uppercase arrow link. Actual product photography uses contain, never distorted cover cropping.
6. White advantages: title/list left, photographic composition right; counter-style verified fact slots below. No copied customer totals, HKA warranty or 24-hour service promises.
7. White partner/client heading and horizontally arranged logos. Adapt to product brands, not customer endorsements.
8. White articles: heading/all link, three image-led columns, metadata and title. New educational content has no fabricated date or author.
9. Full-width photographic testimonial band with dark rectangular text panel right. Approved adaptation: verified service commitments, visibly not endorsements.
10. Closing CTA lives within the dark footer composition: logo and heading/buttons left; navigation and contact columns right; social area only for verified links; fine copyright divider.

## Inner-page templates

- About: shared photographic banner with centered title, two-column introduction, dark vision/mission strip, values/capabilities section, brand treatment. Do not manufacture employees/portraits to fill HKA's team section.
- Products: photographic banner, heading, light-gray checkbox sidebar left, three-column light product cards right and pagination. Brand/category options expand. Adapt with working category/brand/type filters and visible reset/count; no reference search was established.
- Product detail: image/gallery left, taxonomy/title/brand/type and inquiry panel right; description and specification content below, proof strip and four related cards. The reference's three-year warranty is never imported.
- Services: photographic banner; introduction followed by four wide light-gray service rows with ample padding, restrained text and equipment imagery.
- Contact: photographic title banner; introduction, contact rows left and dark form panel right. Adapt the form to a clearly labeled local email composer, not a simulated submission system. Contact page uses a compact footer.
- Articles: photographic banner and three-column editorial grid. Detail follows the same content container and readable article column, with related content/CTA.
- Branches: use its repeated office-information pattern within Liftco's contact page; no extra required route.
- Rental: reuse service template, grouping the three verified rental offerings. No separate HKA rental template was confirmed.

## Verified Liftco content

- Established 10 February 2011 according to About. Official HELI and Mantall representation described there. Five catalog brands: Heli, Mantall, Dingli, LCM, Liftco.
- 68 actual product-detail pages under /harga/; sitemap also includes one catalog landing URL, excluded from product count. Taxonomy and names are taken from page contents, not ambiguous slugs (e.g. 35 can mean 3.5 or 35 tons).
- Service page: warranty up to 2000 HM or one year; original spare parts, on-call service, maintenance contracts after warranty. Do not add conditions not stated by source.
- Contacts: Tangerang main office, Surabaya/Sidoarjo office, Semarang office; 021-29672215 / 021-29672219, 031-7870701; marketing@liftco.co.id, sby@liftco.co.id, semarang@liftco.co.id. No Semarang phone is invented.
- Detailed rental pages state operator supplied by renter; used-unit rental minimum one month and new-unit minimum 24 months where stated; scissor rental minimum one month. Homepage also advertises daily rentals: prefer specific equipment-page terms and ask customers to confirm terms.
- No copied market rankings, certifications, stock status, testimonials or unsupported nationwide response-time promises. Source product tables/diagrams remain attributable to the exact corresponding product.

## Required validation

Three separate passes: structural comparison, visual refinement, then responsive/interactive QA. Reference desktop 1440x900 is primary; also 1920x1080, 768x1024, 390x844. Local checks additionally cover 1024 and 375px. Global pixel differences are not a meaningful accuracy score after intentional imagery/copy/brand replacement. Record observed geometry and remaining differences honestly.

Reference counter markup confirms 2000ms animations. Liftco's warranty fact slots use a 2000ms count-up with reduced-motion bypass; the establishment year remains static. Source market rankings and customer totals are not reused.
