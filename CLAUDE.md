# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal bilingual (English/Greek) portfolio at rigascg.com: a Jekyll site edited through Sveltia CMS (`/admin/`, GitHub token sign-in). GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys it to GitHub Pages; the domain's DNS is at Squarespace (`CNAME` file). Everything must stay zero-cost.

## Commands

```sh
bundle install
bundle exec jekyll serve      # http://localhost:4000
bundle exec jekyll build      # output in _site/
```

There are no tests or linters. Changes are checked in a real browser (headless Chrome / Playwright with `channel="chrome"`). To check `admin/config.yml`, load `/admin/` from a local build: Sveltia lists config problems on its login screen and in the console.

## Deployment constraint

The build depends on a custom plugin (`_plugins/site.rb`), which GitHub's built-in "Deploy from branch" Jekyll builder ignores. The Pages source must be set to **GitHub Actions**. Otherwise the project pages are silently not generated. After adding a gem, run `bundle lock --add-platform x86_64-linux` so CI can install it.

## Content model (what the CMS edits)

- **One file holds both languages.** Translatable fields come in pairs, `<field>_en` / `<field>_el`. Templates read them with the `tr` filter: `{{ obj | tr: "text", page.lang }}`. It falls back to the `_en` value **only when the `_el` key is missing**. An explicit empty string stays empty, because the CV relies on deliberately empty Greek fields.
- **Projects** live in `_projects/<slug>.md`: front matter only, no body. The collection has `output: false`. `Rigas::ProjectPages` in `_plugins/site.rb` generates `/en/portfolio/<slug>/` and `/el/portfolio/<slug>/` pages with `layout: project`, and puts the document's data in `page.project`.
  - The portfolio grid is sorted by `order`. `published: false` hides a project.
  - `old_id` feeds the legacy-URL redirect (see Old URLs below).
- **Project bodies** are a `blocks` list rendered by `_includes/blocks.html`. Block types: `text` (Markdown), `media` (`columns` 1/2, `items` of `image`/`video`/`vimeo`, optional `caption`), `link` and `divider`.
  - `columns` may arrive from the CMS as a number or a string. The template compares it as a string.
- **Other pages:** each is a small stub in `en/` and `el/` (plus the root `index.html` = English home at `/`) that sets `layout`, `lang` and `ref`. The layouts read their content from `_data/` (`cv.yml`, `home.yml`, `contact.yml`, `social.yml`, `i18n.yml` for interface strings).
- **Field definitions** in `admin/config.yml` must stay in sync with these templates and data files.

## Cross-language linking

Every page has a `lang` (`en`/`el`) and a shared `ref` (e.g. `about`; projects use `project:<slug>`). `_includes/url-for.html` resolves a `ref` + `lang` to a URL. The header nav (`site.nav` in `_config.yml`) and the language switch in `_layouts/default.html` use it. URLs use `el`, but the switch displays "gr".

## Front-end behaviour that is easy to break

- **Scrolling happens inside SimpleBar, not the window.** The scroll element is `.simplebar-content-wrapper`.
  - `_layouts/default.html` writes out SimpleBar's DOM structure in advance, so SimpleBar attaches instead of rebuilding the page, which avoids a layout jump.
  - That markup matches the vendored, pinned SimpleBar in `assets/vendor/simplebar/`. If you upgrade SimpleBar, check its `initDOM`.
  - The owner wants SimpleBar kept; don't replace it with CSS scrollbars.
  - `assets/js/site.js` saves and restores the scroll position for Back/reload, because the browser can't remember scroll inside a custom container.
- **Navigation is plain links with cross-document View Transitions** (`@view-transition` in `mystyle.css`). The header has `view-transition-name: site-header` so it stays still.
  - `site.js` clears that name when the header is scrolled out of view.
  - Don't add click-intercepting navigation; middle click and new tab must keep working.
- **Looping gradient animations** use `animation-delay: var(--anim-offset)`, which an inline script in `<head>` sets from the clock so the animation doesn't restart on each page load. New looping animations need the same treatment.
- **`_plugins/site.rb` reads image sizes (FastImage) and MP4 sizes (its own `tkhd` parser) at build time.** The `media_size_attrs` filter outputs `width`/`height` so space is reserved before media loads. Use it for any new `<img>` or `<video>` of local files.
- **Lightbox:** `assets/js/lightbox.js` is loaded only on pages containing `img[data-lightbox]`. It shows each image's `data-caption`, which comes from the image title, then the group caption, then the project title.
- **Kramdown** is configured with `hard_wrap: true` (a single newline becomes `<br>`) and with smart quotes and typographic symbols turned off, so text renders exactly as typed. `.md > p + p` spacing reproduces the old `<br><br>` look.
- **Fonts** (Ubuntu 400/700) are self-hosted in `assets/fonts/` and preloaded in the layout.
- **`mystyle.css` sits at the repo root** and uses URLs relative to it (`assets/fonts/…`, `images/…`); keep that in mind if moving it.

## Old URLs

The previous site used `/?page=<id>&lang=en|gr` (e.g. `p_zagori`). A script that runs only on `/` (in `_layouts/default.html`) redirects these, using each project's `old_id`.

## Standalone folders

`aframe/`, `restoration_app/`, `contest/`, `nutriafmvdocs/` are independent static pages, copied through untouched. They don't use the layout or CMS.
