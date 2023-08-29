import Markdown from 'markdown-to-jsx';
import { CDNImage } from './cdn-image';

function MarkdownLine({ data }: { data: string }) {
  return (
    <Markdown
      options={{
        forceBlock: true,
        overrides: {
          h1: {
            props: {
              className: 'text-5xl font-bold font-serif uppercase',
            },
          },
          h2: {
            props: {
              className: 'text-3xl font-bold font-serif uppercase',
            },
          },
          h3: {
            props: {
              className: 'text-2xl font-bold font-serif uppercase',
            },
          },
          p: {
            props: {
              className: 'text-base font-mono',
            },
          },
          li: {
            props: {
              className: 'font-mono',
            },
          },
          img: {
            component: CDNImage,
            props: {},
          },
        },
      }}
    >
      {data}
    </Markdown>
  );
}

function MarkdownContent({ data }: { data: Array<string> }) {
  return (
    <div className='space-y-4'>
      {data.map((line, index) => (
        <MarkdownLine key={index} data={line} />
      ))}
    </div>
  );
}

export { MarkdownLine, MarkdownContent };
