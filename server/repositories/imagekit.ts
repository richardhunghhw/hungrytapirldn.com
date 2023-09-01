/**
 * Rewriting the imagekit.io SDK to use the fetch API instead of XMLHttpRequest
 */
import { Buffer } from 'node:buffer';
import type { UploadOptions, UploadResponse, FileObject, ListFileOptions } from 'imagekit/dist/libs/interfaces';
import type IKResponse from 'imagekit/dist/libs/interfaces/IKResponse';
import errorMessages from 'imagekit/dist/libs/constants/errorMessages';

const IMAGEKIT_API_URL = 'https://api.imagekit.io/v1/files/';

export class ImageKit {
  #imageKitPrivateKey: string;
  #imageKitPublicKey: string;

  constructor(imageKitPrivateKey: string, imageKitPublicKey: string) {
    this.#imageKitPrivateKey = imageKitPrivateKey;
    this.#imageKitPublicKey = imageKitPublicKey;
  }

  getHeaders() {
    return {
      Authorization: `Basic ${Buffer.from(`${this.#imageKitPrivateKey}:`).toString('base64')}`,
    };
  }

  async listFiles(listOptions: ListFileOptions): Promise<IKResponse<FileObject[]>> {
    if (typeof listOptions !== 'object') {
      new Error(errorMessages.INVALID_LIST_OPTIONS.message);
    }

    if (listOptions && listOptions.tags && Array.isArray(listOptions.tags) && listOptions.tags.length) {
      listOptions.tags = listOptions.tags.join(',');
    }

    // Make the request
    const result = await fetch(`${IMAGEKIT_API_URL}?${new URLSearchParams(listOptions)}`, {
      method: 'GET',
      headers: { ...this.getHeaders() },
    });

    // Deconstruct the response
    const { status, headers } = result;
    const json = (await result.json()) as FileObject[];

    // Return the response
    return {
      $ResponseMetadata: {
        statusCode: status,
        headers: Object.fromEntries(headers.entries()),
      },
      ...json,
    };
  }

  async upload(uploadOptions: UploadOptions): Promise<IKResponse<UploadResponse>> {
    if (typeof uploadOptions !== 'object') {
      throw new Error(errorMessages.MISSING_UPLOAD_DATA.message);
    }

    if (!uploadOptions.file) {
      throw new Error(errorMessages.MISSING_UPLOAD_FILE_PARAMETER.message);
    }

    if (!uploadOptions.fileName) {
      throw new Error(errorMessages.MISSING_UPLOAD_FILENAME_PARAMETER.message);
    }

    const form = new FormData();

    let key: keyof typeof uploadOptions;
    for (key in uploadOptions) {
      if (key) {
        if (key == 'file' && typeof uploadOptions.file != 'string') {
          form.append('file', uploadOptions.file, String(uploadOptions.fileName));
        } else if (key == 'tags' && Array.isArray(uploadOptions.tags)) {
          form.append('tags', uploadOptions.tags.join(','));
        } else if (key == 'responseFields' && Array.isArray(uploadOptions.responseFields)) {
          form.append('responseFields', uploadOptions.responseFields.join(','));
        } else if (key == 'extensions' && Array.isArray(uploadOptions.extensions)) {
          form.append('extensions', JSON.stringify(uploadOptions.extensions));
        } else if (
          key === 'customMetadata' &&
          typeof uploadOptions.customMetadata === 'object' &&
          !Array.isArray(uploadOptions.customMetadata) &&
          uploadOptions.customMetadata !== null
        ) {
          form.append('customMetadata', JSON.stringify(uploadOptions.customMetadata));
        } else {
          form.append(key, String(uploadOptions[key]));
        }
      }
    }

    // Make the request
    const result = await fetch(`${IMAGEKIT_API_URL}upload`, {
      method: 'POST',
      headers: { ...this.getHeaders() },
      body: form,
    });

    // Deconstruct the response
    const { status, headers } = result;
    const json = (await result.json()) as UploadResponse;

    // Return the response
    return {
      $ResponseMetadata: {
        statusCode: status,
        headers: Object.fromEntries(headers.entries()),
      },
      ...json,
    };
  }
}
