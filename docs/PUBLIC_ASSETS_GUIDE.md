# Public Assets Guide

In this project, files placed in the `public` directory are served at the root path during development and after building.

## Correct Usage

When referencing assets from the `public` directory in your components or CSS, you should use the root path `/` instead of including the `public/` folder in the path.

### Examples

| Asset Path | Incorrect Reference | Correct Reference |
| :--- | :--- | :--- |
| `public/heroimage.png` | `/public/heroimage.png` | `/heroimage.png` |
| `public/About.webp` | `/public/About.webp` | `/About.webp` |

### Why?

Vite (and most modern frontend build tools) treats the `public` directory as the root for static assets. During the build process, the contents of `public` are copied directly to the output directory (`dist`) without any path nesting.
