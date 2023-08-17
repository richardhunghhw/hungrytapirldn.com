import Markdown from 'markdown-to-jsx';
import { CDNImage } from './cdn-image';

function MarkdownContent({ data }: { data: Array<string> }) {
  return data.map((line, index) => (
    <Markdown
      key={index}
      options={{
        forceBlock: true,
        overrides: {
          img: {
            component: CDNImage,
            props: {
              className: 'mx-auto',
            },
          },
        },
      }}
    >
      {line}
    </Markdown>
  ));
}

export { MarkdownContent };
