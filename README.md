# Tiny Love Note

A playful, customizable yes-or-no love note built with plain HTML, CSS, and JavaScript.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

## Customize

Use the “personalize this note” button inside the experience. The name, question, and celebration message are saved in the browser.

You can also personalize a shared URL with query parameters:

```text
?name=Amara&question=Will%20you%20marry%20me%3F&message=You%20made%20my%20whole%20year.
```

## Deploy later

The `dist` folder is the publish directory for a static host such as Vercel.
