/**
 * Based entirely on https://github.com/souvikinator/notion-to-md. all credits to @souvikinator
 */
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import * as md from './utils';

type Annotations = {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color:
        | 'default'
        | 'gray'
        | 'brown'
        | 'orange'
        | 'yellow'
        | 'green'
        | 'blue'
        | 'purple'
        | 'pink'
        | 'red'
        | 'gray_background'
        | 'brown_background'
        | 'orange_background'
        | 'yellow_background'
        | 'green_background'
        | 'blue_background'
        | 'purple_background'
        | 'pink_background'
        | 'red_background';
};

/**
 * Annoate text using provided annotations
 * @param {string} text - String to be annotated
 * @param {Annotations} annotations - Annotation object of a notion block
 * @returns {string} - Annotated text
 */
function annotatePlainText(text: string, annotations: Annotations): string {
    // if text is all spaces, don't annotate
    if (text.match(/^\s*$/)) return text;

    const leadingSpaceMatch = text.match(/^(\s*)/);
    const trailingSpaceMatch = text.match(/(\s*)$/);

    const leading_space = leadingSpaceMatch ? leadingSpaceMatch[0] : '';
    const trailing_space = trailingSpaceMatch ? trailingSpaceMatch[0] : '';

    text = text.trim();

    if (text !== '') {
        if (annotations.code) text = md.inlineCode(text);
        if (annotations.bold) text = md.bold(text);
        if (annotations.italic) text = md.italic(text);
        if (annotations.strikethrough) text = md.strikethrough(text);
        if (annotations.underline) text = md.underline(text);
    }

    return leading_space + text + trailing_space;
}

/**
 * Convert a Notion block to Markdown
 */
function blockToMarkdown(block: BlockObjectResponse): string {
    if (typeof block !== 'object' || !('type' in block)) return '';

    let parsedData = '';
    const { type } = block;

    switch (type) {
        case 'image': {
            let blockContent = block.image;
            let image_title = 'image';

            const image_caption_plain = blockContent.caption
                .map((item: any) => item.plain_text)
                .join('');

            const image_type = blockContent.type;
            let link = '';

            if (image_type === 'external') {
                link = blockContent.external.url;
            }

            if (image_type === 'file') {
                link = blockContent.file.url;
            }

            // image caption with high priority
            if (image_caption_plain.trim().length > 0) {
                image_title = image_caption_plain;
            } else if (image_type === 'file' || image_type === 'external') {
                const matches = link.match(
                    /[^\/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/
                );
                image_title = matches ? matches[0] : image_title;
            }

            // return await md.image(
            //     image_title,
            //     link,
            //     this.config.convertImagesToBase64
            // );
        }

        case 'divider': {
            return md.divider();
        }

        case 'equation': {
            return md.equation(block.equation.expression);
        }

        case 'video':
        case 'file':
        case 'pdf':
            {
                let blockContent;
                let title: string = type;

                if (type === 'video') blockContent = block.video;
                if (type === 'file') blockContent = block.file;
                if (type === 'pdf') blockContent = block.pdf;

                const caption = blockContent?.caption
                    .map((item: any) => item.plain_text)
                    .join('');

                if (blockContent) {
                    const file_type = blockContent.type;
                    let link = '';
                    if (file_type === 'external')
                        link = blockContent.external.url;
                    if (file_type === 'file') link = blockContent.file.url;

                    if (caption && caption.trim().length > 0) {
                        title = caption;
                    } else if (link) {
                        const matches = link.match(
                            /[^\/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/
                        );
                        title = matches ? matches[0] : type;
                    }

                    return md.link(title, link);
                }
            }
            break;

        case 'bookmark':
        case 'embed':
        case 'link_preview':
        case 'link_to_page':
            {
                let blockContent;
                let title: string = type;
                if (type === 'bookmark') blockContent = block.bookmark;
                if (type === 'embed') blockContent = block.embed;
                if (type === 'link_preview') blockContent = block.link_preview;
                if (
                    type === 'link_to_page' &&
                    block.link_to_page.type === 'page_id'
                ) {
                    blockContent = { url: block.link_to_page.page_id };
                }

                if (blockContent) return md.link(title, blockContent.url);
            }
            break;

        case 'child_page':
        case 'child_database':
        case 'table':
            throw new Error(`Block type ${type} not supported`);

        // Rest of the types
        // "paragraph"
        // "heading_1"
        // "heading_2"
        // "heading_3"
        // "bulleted_list_item"
        // "numbered_list_item"
        // "quote"
        // "to_do"
        // "template"
        // "synced_block"
        // "child_page"
        // "child_database"
        // "code"
        // "callout"
        // "breadcrumb"
        // "table_of_contents"
        // "link_to_page"
        // "audio"
        // "unsupported"
        default: {
            // In this case typescript is not able to index the types properly, hence ignoring the error
            // @ts-ignore
            let blockContent = block[type].text || block[type].rich_text || [];
            blockContent.map((content: Text | Equation) => {
                if (content.type === 'equation') {
                    parsedData += md.inlineEquation(
                        content.equation.expression
                    );
                    return;
                }

                const annotations = content.annotations;
                let plain_text = content.plain_text;

                plain_text = annotatePlainText(plain_text, annotations);

                if (content['href'])
                    plain_text = md.link(plain_text, content['href']);

                parsedData += plain_text;
            });
        }
    }

    switch (type) {
        case 'code':
            {
                parsedData = md.codeBlock(parsedData, block[type].language);
            }
            break;

        case 'heading_1':
            {
                parsedData = md.heading1(parsedData);
            }
            break;

        case 'heading_2':
            {
                parsedData = md.heading2(parsedData);
            }
            break;

        case 'heading_3':
            {
                parsedData = md.heading3(parsedData);
            }
            break;

        case 'quote':
            {
                parsedData = md.quote(parsedData);
            }
            break;

        // case 'callout':
        //     {
        //         const { id, has_children } = block;
        //         let callout_string = '';

        //         if (!has_children) {
        //             return md.callout(parsedData, block[type].icon);
        //         }

        //         const callout_children_object = await getBlockChildren(
        //             this.notionClient,
        //             id,
        //             100
        //         );

        //         // // parse children blocks to md object
        //         const callout_children = await this.blocksToMarkdown(
        //             callout_children_object
        //         );

        //         callout_string += `${parsedData}\n`;
        //         callout_children.map((child) => {
        //             callout_string += `${child.parent}\n\n`;
        //         });

        //         parsedData = md.callout(
        //             callout_string.trim(),
        //             block[type].icon
        //         );
        //     }
        //     break;

        case 'bulleted_list_item':
            {
                parsedData = md.bullet(parsedData);
            }
            break;

        case 'numbered_list_item':
            {
                parsedData = md.bullet(
                    parsedData,
                    block.numbered_list_item.number
                );
            }
            break;

        case 'to_do':
            {
                parsedData = md.todo(parsedData, block.to_do.checked);
            }
            break;
    }

    return parsedData;
}

function blocksToMarkdown(blocks: Array<BlockObjectResponse>): Array<string> {
    return blocks.map((block) => blockToMarkdown(block));
}

export { blockToMarkdown, blocksToMarkdown };
