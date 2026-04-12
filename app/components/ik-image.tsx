/**
 * Lightweight IKImage replacement for imagekitio-react.
 *
 * imagekitio-react v3 ships Babel-compiled async generators that require
 * `regeneratorRuntime`, causing a ReferenceError crash on every page load.
 * This component replicates the URL-building and rendering behaviour without
 * any async code or runtime polyfills.
 */

const SUPPORTED_TRANSFORMS: Record<string, string> = {
  width: 'w',
  height: 'h',
  aspectRatio: 'ar',
  quality: 'q',
  crop: 'c',
  cropMode: 'cm',
  focus: 'fo',
  x: 'x',
  y: 'y',
  format: 'f',
  radius: 'r',
  background: 'bg',
  border: 'b',
  rotation: 'rt',
  rotate: 'rt',
  blur: 'bl',
  named: 'n',
  progressive: 'pr',
  lossless: 'lo',
  trim: 't',
  metadata: 'md',
  colorProfile: 'cp',
  dpr: 'dpr',
  effectSharpen: 'e-sharpen',
  effectUSM: 'e-usm',
  effectContrast: 'e-contrast',
  effectGray: 'e-grayscale',
  original: 'orig',
  raw: 'raw',
};

function buildTransformationString(transformation: Array<Record<string, unknown>>): string {
  if (!Array.isArray(transformation) || transformation.length === 0) return '';

  return transformation
    .map((step) =>
      Object.entries(step)
        .map(([key, value]) => {
          const transformKey =
            SUPPORTED_TRANSFORMS[key] ?? SUPPORTED_TRANSFORMS[key.toLowerCase()] ?? key;
          if (value === '-') return transformKey;
          if (key === 'raw') return String(value);
          return `${transformKey}-${value}`;
        })
        .join(','),
    )
    .join(':');
}

function buildImageKitUrl(opts: {
  urlEndpoint: string;
  path?: string;
  src?: string;
  transformation?: Array<Record<string, unknown>>;
}): string {
  if (!opts.path && !opts.src) return '';

  const trString = buildTransformationString(opts.transformation ?? []);

  if (opts.path) {
    const endpoint = opts.urlEndpoint.replace(/\/$/, '');
    const path = opts.path.replace(/^\//, '');
    return trString ? `${endpoint}/tr:${trString}/${path}` : `${endpoint}/${path}`;
  }

  // src-based URL
  try {
    const url = new URL(opts.src!);
    if (trString) url.searchParams.append('tr', trString);
    return url.href;
  } catch {
    return opts.src ?? '';
  }
}

type IKImageProps = {
  urlEndpoint: string;
  path?: string;
  src?: string;
  transformation?: Array<Record<string, unknown>>;
  /** Low-quality image placeholder — kept for API compatibility but not rendered. */
  lqip?: { active?: boolean; quality?: number; blur?: number; raw?: string };
  loading?: 'lazy' | 'eager';
  alt?: string;
  [key: string]: unknown;
};

export function IKImage({
  urlEndpoint,
  path,
  src,
  transformation = [],
  lqip: _lqip,
  loading = 'lazy',
  alt = '',
  ...rest
}: IKImageProps) {
  const imageSrc = buildImageKitUrl({ urlEndpoint, path, src, transformation });

  return <img src={imageSrc} alt={alt} loading={loading} {...(rest as Record<string, unknown>)} />;
}
