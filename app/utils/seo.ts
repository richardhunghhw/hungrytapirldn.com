export function getSeoMetas({
  url,
  title = 'Hungry Tapir | Best Kaya in London',
  description = '',
  image = '',
  keywords = '',
}: {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
}) {
  return [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },

    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:site_name', content: 'Hungry Tapir LDN' },
    { property: 'og:type', content: 'website' },
    // { property: "og:image", content: image },
    { property: 'og:image:alt', content: title },
    { property: 'og:url', content: url },

    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@hungrytapirldn' },
    { name: 'twitter:creator', content: '@hungrytapirldn' },
    // { name: "twitter:image", content: image },
    { name: 'twitter:image:alt', content: title },
  ];
}
