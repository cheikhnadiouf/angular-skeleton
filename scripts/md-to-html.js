const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const template = (title, content) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Roboto', sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #1976d2; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
        code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .mermaid { text-align: center; margin: 20px 0; }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({startOnLoad:true, theme: 'default'});
        document.addEventListener('DOMContentLoaded', function() {
            const codeBlocks = document.querySelectorAll('pre code.language-mermaid');
            codeBlocks.forEach((block, index) => {
                const mermaidDiv = document.createElement('div');
                mermaidDiv.className = 'mermaid';
                mermaidDiv.textContent = block.textContent;
                block.parentElement.replaceWith(mermaidDiv);
            });
        });
    </script>
</head>
<body>${content}</body>
</html>`;

const convertMdToHtml = (mdPath, htmlPath) => {
    if (fs.existsSync(mdPath)) {
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang === 'mermaid') {
                    return `<div class="mermaid">${code}</div>`;
                }
                return code;
            }
        });
        const markdown = fs.readFileSync(mdPath, 'utf8');
        let html = marked(markdown);
        // Fix HTML entities in mermaid diagrams
        html = html.replace(/&amp;#br;/g, '#br;');
        html = html.replace(/&amp;br;/g, '#br;');
        html = html.replace(/&amp;/g, '&');
        html = html.replace(/&lt;br\/&gt;/g, '<br/>');
        html = html.replace(/&lt;br&gt;/g, '<br>');
        const title = path.basename(mdPath, '.md');
        fs.writeFileSync(htmlPath, template(title, html));
    }
};

// Convert markdown files
const docsDir = path.join(__dirname, '..', 'docs');
convertMdToHtml(
    path.join(docsDir, 'app-documentation.md'),
    path.join(docsDir, 'app-documentation.html')
);
convertMdToHtml(
    path.join(docsDir, 'diagrams', 'app-architecture.md'),
    path.join(docsDir, 'diagrams', 'app-architecture.html')
);
convertMdToHtml(
    path.join(docsDir, 'performance-guideline.md'),
    path.join(docsDir, 'performance-guideline.html')
);

console.log('✅ Markdown files converted to HTML');