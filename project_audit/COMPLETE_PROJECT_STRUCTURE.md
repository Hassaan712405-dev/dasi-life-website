# Complete Project Structure

The tree below is the repository inventory reviewed for this audit. `.env.local` is listed by filename only; secret values are deliberately not reproduced. `node_modules`, `.next`, `.git`, and other generated/dependency trees were excluded from the source inventory. The pre-existing `audit-report.txt` and `build-output.txt` were not treated as source-of-truth documentation and were not copied into this audit.

```text
dasi-life-website-main/
├── .env.local                         # Local environment file; values withheld
├── .gitignore                         # Ignores dependencies, build outputs, env files, logs
├── audit-report.txt                   # Existing text artifact; not used as code evidence
├── build-output.txt                   # Existing build/log artifact; not used as code evidence
├── next.config.js                     # Next build, images, compiler, compression settings
├── package.json                       # Package identity, scripts, dependencies
├── package-lock.json                  # npm lockfile
├── postcss.config.js                  # Tailwind and Autoprefixer plugins
├── proxy.ts                           # Supabase session refresh and route gating
├── tailwind.config.js                 # Tailwind content paths, theme and colors/fonts
├── tsconfig.json                      # Strict TypeScript and @/* import alias
├── app/
│   ├── apple-icon.png                 # Apple home-screen icon asset
│   ├── favicon.ico                    # Browser favicon
│   ├── icon.png                       # App icon
│   ├── globals.css                    # Global styles, fonts, buttons, reduced motion, print
│   ├── layout.tsx                     # Root layout, metadata, providers, analytics, header/footer
│   ├── manifest.ts                    # PWA/web app manifest
│   ├── not-found.tsx                  # Not-found UI
│   ├── page.tsx                       # Homepage section composition
│   ├── robots.ts                      # Robots policy and sitemap URL
│   ├── sitemap.ts                     # Static and Supabase-derived product/category URLs
│   ├── about/page.tsx                 # Brand/story page
│   ├── account/
│   │   ├── page.tsx                   # Account dashboard/landing
│   │   ├── addresses/page.tsx         # Customer address book
│   │   ├── orders/page.tsx            # Customer order history
│   │   └── profile/page.tsx           # Profile, default address and password forms
│   ├── admin/
│   │   ├── layout.tsx                 # Admin shell, navigation and client-side role check
│   │   ├── page.tsx                   # Admin dashboard
│   │   ├── categories/page.tsx        # Category management
│   │   ├── cms/page.tsx               # CMS page management
│   │   ├── contact-messages/page.tsx  # Contact message inbox
│   │   ├── customers/page.tsx         # Customer list/detail
│   │   ├── orders/page.tsx            # Order list/status management
│   │   ├── products/page.tsx          # Product list/bulk management
│   │   ├── products/new/page.tsx      # Product creation form
│   │   ├── products/[id]/page.tsx     # Product editing form
│   │   ├── reviews/page.tsx           # Review moderation
│   │   └── settings/page.tsx          # Store settings
│   ├── admin-login/
│   │   ├── layout.tsx                 # Admin-login layout
│   │   └── page.tsx                   # Admin sign-in and admin_users check
│   ├── auth/callback/route.ts         # GET callback: exchange auth code and redirect
│   ├── cart/page.tsx                  # Browser-persisted shopping cart
│   ├── category/[slug]/page.tsx       # Dynamic category product listing
│   ├── checkout/page.tsx              # Checkout form and order submission
│   ├── contact/page.tsx               # Contact form
│   ├── faq/page.tsx                   # Searchable/category-filtered FAQ
│   ├── forgot-password/page.tsx       # Supabase password reset request
│   ├── login/page.tsx                 # Customer password and Google OAuth login
│   ├── order-success/page.tsx         # Order confirmation/details fetched by order number
│   ├── privacy/page.tsx               # Privacy policy content
│   ├── product/[slug]/page.tsx        # Product details, metadata and structured data
│   ├── register/page.tsx              # Customer registration
│   ├── reset-password/page.tsx        # Password reset form
│   ├── returns/page.tsx               # Returns policy
│   ├── search/page.tsx                # Server-rendered product search results
│   ├── shipping/page.tsx              # Shipping policy/content
│   ├── shop/page.tsx                  # Product catalog and query-string filters
│   ├── terms/page.tsx                 # Terms content
│   ├── track-order/page.tsx           # Order-number lookup and status timeline
│   └── wishlist/page.tsx              # Wishlist page
├── components/
│   ├── account/AccountSidebar.tsx      # Account navigation sidebar
│   ├── admin/
│   │   ├── NotificationDropdown.tsx   # Admin notification UI
│   │   └── OrderPrintLabel.tsx        # Printable order/shipping label
│   ├── analytics/MetaPixel.tsx        # Optional Meta Pixel bootstrapping/page views
│   ├── cart/
│   │   ├── CartItem.tsx               # Cart row and quantity/removal controls
│   │   └── CartSummary.tsx            # Subtotal and checkout CTA
│   ├── checkout/
│   │   ├── CheckoutForm.tsx           # Shipping/contact form component
│   │   └── OrderSummary.tsx           # Checkout totals summary
│   ├── layout/
│   │   ├── BestsellersSection.tsx     # Featured product cards
│   │   ├── CategoriesSection.tsx      # Category landing cards
│   │   ├── Footer.tsx                 # Contact, social, policy and product links
│   │   ├── Header.tsx                 # Main navigation, mobile menu, search and account/cart
│   │   ├── HeroSection.tsx             # Homepage hero
│   │   ├── Newsletter.tsx             # Newsletter form UI
│   │   ├── ReviewsSection.tsx          # Homepage review/social proof section
│   │   ├── RootedSection.tsx            # Homepage brand/story section
│   │   ├── TrustBadges.tsx              # Trust/benefit badges
│   │   └── WhyChooseUs.tsx              # Homepage value proposition section
│   ├── motion/
│   │   ├── FadeIn.tsx                  # Fade/entrance animation wrapper
│   │   ├── FloatingElement.tsx         # Floating animation wrapper
│   │   ├── HoverScale.tsx              # Hover-scale wrapper
│   │   ├── PageTransition.tsx          # Route/page transition wrapper
│   │   ├── ParallaxImage.tsx           # Parallax image effect
│   │   ├── ScrollProgress.tsx          # Scroll progress UI
│   │   └── Stagger.tsx                 # Staggered entrance animation wrappers
│   ├── orders/OrderTimeline.tsx         # Order status timeline display
│   └── products/
│       ├── ProductBenefits.tsx          # Product benefit section
│       ├── ProductCard.tsx              # Reusable product card/cart/wishlist actions
│       ├── ProductGallery.tsx           # Product image gallery
│       ├── ProductInfo.tsx              # Product price, details and purchase controls
│       ├── ProductTabs.tsx              # Product information/review tabs
│       ├── ProductVariants.tsx          # Variant selector
│       ├── ProductVideo.tsx             # Optional product video block
│       ├── ReviewSection.tsx             # Rating summary and review submission
│       ├── ShopSidebar.tsx               # Category, price and sort controls
│       └── StickyCTA.tsx                 # Mobile product purchase CTA
├── contexts/
│   ├── CartContext.tsx                  # Local-storage cart state and totals
│   ├── SettingsContext.tsx              # Store settings context
│   └── WishlistContext.tsx               # Guest/local and signed-in wishlist state
├── hooks/
│   └── useAuth.ts                        # Supabase browser auth/session/admin state
├── lib/
│   ├── analytics/events.ts               # GA4/Meta commerce event helpers
│   ├── supabase/
│   │   ├── client.ts                     # Browser Supabase SSR client singleton
│   │   ├── public.ts                     # Cookie-free anon client for public data
│   │   └── server.ts                     # Cookie-aware server Supabase client
│   └── utils/
│       ├── formatCurrency.ts             # Currency formatting helper
│       └── productImage.ts               # Product image URL fallback/helper
├── public/
│   ├── icons/fav-icon.png                # Public favicon asset
│   └── images/
│       ├── hero-majoon.png               # Homepage hero image
│       ├── logo.png                      # Store logo
│       ├── product-hair-oil.png          # Product image
│       ├── product-joint-bone.png        # Product image
│       ├── product-majoon.png            # Product image
│       └── product-weight-loss.png       # Product image
├── services/
│   ├── admin/
│   │   ├── adminService.ts               # Dashboard metrics, recent orders, stock/revenue summaries
│   │   ├── categoryAdmin.ts              # Category CRUD/counts
│   │   ├── cmsAdmin.ts                   # CMS page reads/updates
│   │   ├── customerAdmin.ts              # Customer/order summaries
│   │   ├── notificationService.ts        # Derived notifications from orders/reviews/stock
│   │   ├── orderAdmin.ts                 # Admin order reads/status changes/restocking
│   │   ├── productAdmin.ts               # Product CRUD and bulk actions
│   │   ├── reviewAdmin.ts                # Review approval/removal and rating recalculation
│   │   └── storageService.ts             # Supabase Storage product image upload/delete
│   ├── auth/authService.ts               # Sign-up/sign-in/out, admin check, password reset
│   ├── contact/contactService.ts         # Contact message submission/admin reads/status
│   ├── orders/orderService.ts             # Checkout order creation, order reads/tracking
│   ├── products/
│   │   ├── getProduct.ts                 # Product helper (source file present)
│   │   ├── getProducts.ts                # Public product/category query functions
│   │   ├── inventoryService.ts           # Stock checks, stock reductions/restores, low-stock query
│   │   └── searchProducts.ts             # Product search query
│   ├── profile/profileService.ts          # Profile and address CRUD
│   ├── reviews/reviewService.ts           # Public approved reviews, eligibility and submission
│   ├── settings/settingsService.ts        # Store settings read/update/shipping calculation
│   └── wishlist/wishlistService.ts        # Signed-in wishlist data operations
└── types/
    ├── cart.ts                            # Cart item/context types
    ├── database.ts                        # Hand-maintained Product/Category/Review/Order shapes
    ├── global.d.ts                        # Global declarations (including analytics globals)
    └── order.ts                           # Order input, record, status and result types
```

## Structural observations

- `app/` contains the route tree; no `app/api/` directory or other first-party HTTP API routes were found. The only route handler is `app/auth/callback/route.ts`; `proxy.ts` is the Next request proxy.
- There are no checked-in SQL migration, seed, schema, or Supabase config directories in the inventory.
- There are no visible test directories or test files in the inventory.
- No separate reusable form-validation schemas were found despite Zod and React Hook Form dependencies.
- The generated reports are new files under `project_audit/`; no existing application file was changed.
