import Markdown from 'markdown-to-jsx';
import { CDNImage } from './cdn-image';

function MarkdownLine({ key, data }: { key?: number; data: string }) {
  return (
    <Markdown
      key={key}
      options={{
        forceBlock: true,
        overrides: {
          h1: {
            props: {
              className: 'text-5xl font-bold font-mono',
            },
          },
          h2: {
            props: {
              className: 'text-3xl font-bold font-mono',
            },
          },
          h3: {
            props: {
              className: 'text-2xl font-bold font-mono',
            },
          },
          p: {
            props: {
              className: 'text-base font-mono',
            },
          },
          img: {
            component: CDNImage,
            props: {
              className: 'mx-auto',
            },
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
