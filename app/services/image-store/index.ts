/**
 * Interface to ImageKit for image-store. For the following operations:
 */

import type { AppLoadContext } from '@remix-run/cloudflare';
import type { ContentType } from '../content-store';
import { listFiles, upload as uploadToImagekit } from './imagekit';

const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/nixibbzora/';

function contentTypeToFolder(type: ContentType): string {
  switch (type) {
    case 'general':
      return 'hungrytapir/general';
    case 'blog':
      return 'hungrytapir/blog';
    case 'product':
      return 'hungrytapir/product';
    case 'faq':
      return 'hungrytapir/faq';
    case 'stalldate':
    default:
      console.error(`Content type [${type}] not configured for image upload!`);
      throw new Error(`Content type [${type}] not configured for image upload!`);
  }
}

async function upload(
  context: AppLoadContext,
  replaceImages: boolean,
  file: string,
  fileName: string,
  type: ContentType,
  // tags?: string[],
): Promise<string> {
  // Check if file already exists
  if (!replaceImages) {
    const fileDetails = await listFiles(context, {
      name: fileName,
    });
    if (fileDetails.$ResponseMetadata.statusCode !== 200) {
      throw new Error(
        `Error listing files: code [${fileDetails.$ResponseMetadata.statusCode}], message [${fileDetails.message}]`,
      );
    }
    if (fileDetails && '0' in fileDetails) {
      // File already exists, skip upload
      return fileDetails['0'].url;
    }
  }

  // Upload file to ImageKit
  const uploadedFile = await uploadToImagekit(context, {
    file,
    fileName,
    folder: contentTypeToFolder(type),
    useUniqueFileName: false,
    // tags,
  });
  if (uploadedFile.$ResponseMetadata.statusCode !== 200) {
    throw new Error(
      `Error listing files: code [${uploadedFile.$ResponseMetadata.statusCode}], message [${uploadedFile.message}]`,
    );
  }
  return uploadedFile.url;
}

export { IMAGEKIT_URL_ENDPOINT, upload };
