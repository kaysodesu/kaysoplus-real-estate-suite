# KaysoPlus Real Estate Suite

One real estate workspace built by blending four Google AI Studio prototypes into a single app with no duplicated features.
Beta · Developed by Cason Point Network. **Use made-up information only.**

**Live demo:** https://kaysodesu.github.io/kaysoplus-real-estate-suite/. Runs entirely in your browser with sample data, and anything you add is saved only on your device. The AI listing writer uses built-in templates on the demo; run it locally with a Gemini key for live AI copy. To update the demo: `npm run build:pages`, then publish the `dist-pages` folder to the `gh-pages` branch.

## Sections

| Section | What it does | Came from |
|---|---|---|
| **Property Operations** | Prospect intake and screening, room-split property inventory, leases, rent ledger and rent calendar, maintenance, vendors and tenant communications | Prospect & Property Management Portal |
| **Virtual Tours** | Schedule video tours, lease reviews, move-in orientations and inspections for any property in your inventory | EstatePulse |
| **Listing Studio** | Client CRM plus AI listing copy (luxury, first-time buyer, social thread, Zillow-optimized) with refine tools and a printable PDF flyer | PropScript CRM + PropScribe AI (flyer) |
| **Policies & Automation** | Payment schedules, grace periods and late fees, co-living house rules, automatic rent reminders | EstatePulse |

## How the sections share data
- **One property inventory.** Properties added in Property Operations show up in the Virtual Tours property picker and in Listing Studio's "Fill from Property Inventory" option.
- **One prospect list.** Tours start from the same prospects you screen in Property Operations.
- **Saved automatically** in the browser between visits (prospects, properties, leases, ledger, calendar, maintenance, vendors, tours).

## Removed as duplicates
| Duplicate feature | Kept version | Dropped version |
|---|---|---|
| Leads / prospects | Property Operations (screening, background, fees) | EstatePulse Leads |
| Property inventory | Property Operations (room splits, utilities, fees) | EstatePulse Properties |
| Lease agreements | Property Operations | EstatePulse lease modal |
| Rent ledger & calendar | Property Operations | EstatePulse Ledger and Calendar |
| Messages / maintenance | Property Operations Support | EstatePulse Messages and Maintenance |
| AI listing copy | Listing Studio (real AI with fallback) | PropScribe's scripted demo |

PropScribe's public marketing site (pricing, checkout, sign-in) stays in its own repo; it sells the product rather than running the business.

## Fixes made while blending
- Virtual Tours had no way to choose a property (every tour went to the first one); a property picker now lists your inventory.
- Prospect Portal data was lost on every reload; it is now saved.
- The PDF flyer's sample agent name and phone number were replaced with editable placeholders.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
```
Production: `npm run build` then `npm start`. Optional `.env`: `GEMINI_API_KEY` for real AI copy (without it, Listing Studio uses built-in templates).


[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T5N72AQZSL)
