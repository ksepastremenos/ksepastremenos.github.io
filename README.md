# rigascg.com

Personal portfolio. Jekyll site, edited with [Sveltia CMS](https://sveltiacms.app), built and deployed by GitHub Actions to GitHub Pages.

## Editing content

Open <https://rigascg.com/admin/>, choose **Sign In Using Access Token** and paste a fine-grained GitHub token
(this repository only, permission *Contents: read and write*). Every save is a commit to `main`; the site
rebuilds in about a minute (see the Actions tab).

| What | Where in the CMS | File |
|---|---|---|
| Projects (add / remove / reorder) | Portfolio | `_projects/<slug>.md` |
| CV | Pages → CV | `_data/cv.yml` |
| Home, contact, footer links, menu text | Pages | `_data/*.yml` |

Each project holds both languages. A Greek (GR) field that is missing falls back to English.

## Working locally

```sh
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

## Layout of the code

- `_layouts/` – page templates (`default` = header/footer, `project`, `portfolio`, `cv`, `home`, `contact`)
- `_includes/blocks.html` – renders a project's content blocks
- `_plugins/site.rb` – generates `/en/…` and `/el/…` project pages, reads image/video sizes at build time
- `assets/js/site.js` – scroll position, clipboard, CV sections; `assets/js/lightbox.js` – image viewer
- `aframe/`, `restoration_app/`, `contest/`, `nutriafmvdocs/` – standalone pages, copied as they are
- Old links (`/?page=p_zagori&lang=gr`) are redirected by a script in `_layouts/default.html`
