import Markdown from 'markdown-to-jsx';

function MarkdownContent({ data }: { data: Array<string> }) {
  return data.map((line, index) => (
    <Markdown key={index} options={{ forceBlock: true }}>
      {line}
    </Markdown>
  ));
}

export { MarkdownContent };
