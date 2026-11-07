# Pages, Routes, Components, and Feature Status

Status means **implemented in repository source**, not live-system verification. Supabase policy/configuration may still prevent or change runtime behavior.

## Customer-facing routes

| Route | Source | Source-verified behavior/status |
|---|---|---|
| `/` | `app/page.tsx` | Homepage composes hero, trust badges, featured products, brand/story, categories, reviews, value proposition and newsletter sections; revalidation set to 3,600 seconds. |
| `/shop` | `app/shop/page.tsx` | Server component queries categories/products; supports category query, min/max price and popularity/price/newest sort. Requests up to 100 products. Count label is total active catalog count, not the filtered result count. |
| `/category/[slug]` | `app/category/[slug]/page.tsx` | Validates the slug against queried categories, displays product listing and the shared sidebar, supports price/sort query parameters, returns not-found for unknown category. |
| `/product/[slug]` | `app/product/[slug]/page.tsx` | Active product lookup, metadata/OG tags, product and breadcrumb JSON-LD, gallery/info/variants/video/benefits/tabs/sticky CTA and generic related items. Product is revalidated hourly. Related lookup currently passes an undefined category regardless of product category. |
| `/search` | `app/search/page.tsx` | Query-string search via `searchProducts`, result list, empty states and GET search form. Service searches active product name, slug and short description; limit is 50 here. |
| `/cart` | `app/cart/page.tsx` | Client-side cart display, quantity/removal items, summary and empty state. Cart data is localStorage-backed by `CartContext`. |
| `/checkout` | `app/checkout/page.tsx` | Shipping/contact form, profile autofill, settings-based shipping display and calls `createOrder`; implementation supports COD order creation. **Unauthenticated access is redirected by `proxy.ts`, so the guest checkout UI/service path is unreachable without changing the guard.** |
| `/order-success` | `app/order-success/page.tsx` | Fetches order and items using an `order` query parameter and tracks purchase analytics. The query is by order number and requests `*`; policy-dependent privacy concern is detailed in the audit. |
| `/track-order` | `app/track-order/page.tsx` | Order-number lookup, customer/order details and status timeline; subscribes to Supabase Realtime updates for order/status-history changes. The database and Realtime policies control whether lookup/subscription succeeds. |
| `/wishlist` | `app/wishlist/page.tsx` | Loads product details for wishlist IDs; wishlist context supports guest localStorage and signed-in Supabase lists. Proxy requires authentication for the route despite guest context behavior. |
| `/login` | `app/login/page.tsx` | Email/password sign-in, Google OAuth, redirect query handling and password-reset links. |
| `/register` | `app/register/page.tsx` | Customer registration, name/email/phone/password checks, terms agreement and confirmation state. |
| `/forgot-password` | `app/forgot-password/page.tsx` | Calls Supabase Auth reset email function. |
| `/reset-password` | `app/reset-password/page.tsx` | Requires an existing Supabase session, checks password confirmation/length and changes password. |
| `/auth/callback` | `app/auth/callback/route.ts` | GET handler exchanges a Supabase auth code for session and redirects to `next` or login error. |
| `/account` | `app/account/page.tsx` | Account landing; protected by proxy. |
| `/account/orders` | `app/account/orders/page.tsx` | Signed-in order history; protected by proxy. |
| `/account/profile` | `app/account/profile/page.tsx` | Profile, default shipping address and password-change forms; protected by proxy. |
| `/account/addresses` | `app/account/addresses/page.tsx` | Address add/edit/delete/default controls; protected by proxy. |
| `/contact` | `app/contact/page.tsx` | Validates required fields in the browser and writes to `contact_messages`. No email-send integration was found. |
| `/about` | `app/about/page.tsx` | Static brand values, milestones and claims plus external Unsplash image. |
| `/faq` | `app/faq/page.tsx` | Static searchable accordion/category list. |
| `/shipping` | `app/shipping/page.tsx` | Shipping policy/content page. |
| `/returns` | `app/returns/page.tsx` | Returns policy/content page. |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy/content page. |
| `/terms` | `app/terms/page.tsx` | Terms content page. |
| Not found | `app/not-found.tsx` | App not-found route UI. |

### Navigation and interaction

- `components/layout/Header.tsx` provides desktop navigation (Home, Shop All, Our Story, Contact Us, FAQ), mobile menu, product search/autocomplete, account actions, wishlist and cart counts. Search waits for two characters, debounces the query, and exposes a `/` keyboard shortcut outside text inputs.
- `components/layout/Footer.tsx` supplies category shortcuts, customer service/legal links, store contact/social links. `SettingsContext` provides configurable footer contact values.
- `components/account/AccountSidebar.tsx` is the account navigation component.
- Shop/category listing uses `ShopSidebar.tsx` for category selection, fixed Rs 1,000–3,000 range sliders, and sort order. On `/category/[slug]`, category buttons only change query parameters while the page's product query continues using the path slug; they do not navigate to the selected category or `/shop`.
- Product card add-to-cart and wishlist actions are implemented in `ProductCard.tsx`; product detail interactions are divided into `ProductInfo`, `ProductVariants`, `ProductGallery`, `ProductTabs`, `StickyCTA`, and `ReviewSection`.
- Responsive behavior is implemented mainly through Tailwind breakpoint classes, with a mobile menu, mobile product CTA, responsive grids and layouts. Motion wrappers are in `components/motion/`; global CSS includes a reduced-motion media rule.

## Admin routes

| Route | Source | Source-verified behavior/status |
|---|---|---|
| `/admin-login` | `app/admin-login/page.tsx` | Password login followed by an `admin_users` lookup; signs out non-admin users. |
| `/admin` | `app/admin/page.tsx` | Dashboard metrics, recent orders, low-stock list and revenue chart. Source uses client-side Supabase services. |
| `/admin/products` | `app/admin/products/page.tsx` | Product list/search/category filter, single delete and bulk activation/deactivation/deletion. |
| `/admin/products/new` | `app/admin/products/new/page.tsx` | Product creation page. |
| `/admin/products/[id]` | `app/admin/products/[id]/page.tsx` | Product edit page. |
| `/admin/categories` | `app/admin/categories/page.tsx` | Category management backed by `categoryAdmin.ts`. |
| `/admin/orders` | `app/admin/orders/page.tsx` | Order list/search/status filtering, detail view, status changes and print label UI. |
| `/admin/customers` | `app/admin/customers/page.tsx` | Customer profiles and order summaries. |
| `/admin/reviews` | `app/admin/reviews/page.tsx` | Approve/unapprove/delete reviews. |
| `/admin/cms` | `app/admin/cms/page.tsx` | CMS page listing/content editing using `pages`. |
| `/admin/contact-messages` | `app/admin/contact-messages/page.tsx` | Inbox, status update and delete actions. |
| `/admin/settings` | `app/admin/settings/page.tsx` | Site/store settings editing. |

`app/admin/layout.tsx` provides the dashboard shell, sidebar links, notification and count UI, and a client-side check of `admin_users`. The request proxy also checks signed-in status and the `admin_users` row on `/admin*`. Actual data authorization still depends on database RLS because these admin services use the browser/anon client rather than a server-side authorization layer.

## E-commerce feature audit

| Feature | Evidence/status |
|---|---|
| Homepage, categories and catalog | Implemented from app sections and Supabase-backed product/category reads. |
| Product detail and variants | Implemented. Product data includes price, stock, variants, images, descriptions and related information in source types/queries. |
| Search | Implemented against name, slug and short description. |
| Filtering/sorting | Category, min/max price and sort order are implemented; UI/category routing and total-count behavior have inconsistencies (see issues report). |
| Inventory | Stock check/reduce/restore helpers exist, but read-then-write stock operations are non-atomic and errors are sometimes logged without failing order/status flows. |
| Cart | Implemented in browser localStorage; no server-side cart persistence. |
| Checkout/orders | COD order flow exists. Guest order logic is present but protected by the route proxy. Price and stock validation in `orderService.ts` executes client-side, not in a trusted server boundary. |
| Customer registration/login | Supabase password login/signup, Google OAuth, email confirmation flow, password reset/change. Runtime provider setup is unverified. |
| Customer profiles/addresses/orders | CRUD and reads are implemented through Supabase services; row policies not in repository. |
| Shipping | UI reads shipping fee/free threshold; checkout order service recalculates from settings. No courier integration found. Settings include `shipping_enabled`, but checkout calculations do not use it. |
| Discounts/coupons | Order input type has `couponCode`, but checkout supplies no coupon and `createOrder` sets server discount to zero. No coupon service/table integration found. |
| Payments | COD is the only verified order method in `createOrder` (`payment_method: 'COD'`). No card/wallet/gateway integration found. `bankTransferEnabled` exists in checkout state but no actual payment path was found. |
| Admin | Dashboard, product/category/order/customer/review/CMS/contact/settings routes and services are present. All database operations are initiated through client Supabase services; RLS is critical. |
| Reviews | Signed-in submission checks for a prior review and a shipped/delivered purchase, starts unapproved, and admin review service recalculates product rating. These checks are in client code; DB enforcement is unverified. |
| Wishlist | Guest localStorage and signed-in wishlist tables supported in context/service. Page route requires auth in proxy. |
| Notifications | Admin notification list is derived from recent orders, pending reviews and low-stock products. No external/push/email notification integration found. |
| Contact | Contact form inserts a DB record; no mailer or third-party ticket/email service found. |
| Newsletter | Homepage form only updates local UI state and shows a temporary “Subscribed” state; no subscription API or persistence is wired. |

## Responsive design, styling and accessibility

- Tailwind CSS with custom cream/green/gold theme; global fonts are imported from Fontshare and Google Fonts in `app/globals.css`.
- Product listings use mobile-first grids; header changes to a mobile menu below the large breakpoint; forms and account/admin layouts use responsive columns.
- `prefers-reduced-motion` is implemented globally; print styling targets `#print-label`.
- Some controls have accessible names, but labeling/keyboard behavior was not tested with assistive technology. Several labels are visual labels without explicit `htmlFor`/`id` pairing; review star buttons and animated overlays should be checked for focus and screen-reader support.

## SEO

- Root metadata, canonical root, Open Graph/Twitter details and Organization/WebSite JSON-LD are in `app/layout.tsx`.
- Product metadata and Product/Breadcrumb JSON-LD are generated in product pages.
- `robots.ts`, `sitemap.ts`, and `manifest.ts` are implemented.
- `robots.ts` and sitemap include `/track-order`, a route that accepts an order number and queries order data; review indexability and data access before exposing this route to crawlers.
